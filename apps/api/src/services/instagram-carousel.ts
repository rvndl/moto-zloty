import type {
  PublishWeeklyEventsBodyType,
  PublishWeeklyEventsResponseType,
} from "../models/instagram-carousel";
import type { StateGroup } from "../lib/instagram-carousel";
import { FacebookGraphService } from "./facebook-graph";
import {
  buildInstagramCarouselCaption,
  buildInstagramCarouselHashtags,
  generateInstagramCarouselSlides,
  groupInstagramCarouselEventsByState,
  resolveInstagramCarouselPublicBaseUrl,
  resolveInstagramGraphCredentials,
  type UploadedGeneratedSlide,
  uploadInstagramCarouselSlide,
} from "./instagram-carousel.helpers";
import { err, ok, type ServiceResult } from "./types";

const INSTAGRAM_CAROUSEL_ASPECT_RATIO = "4:5" as const;

export abstract class InstagramCarouselService {
  static async publishWeeklyEvents(
    payload: PublishWeeklyEventsBodyType,
  ): Promise<ServiceResult<PublishWeeklyEventsResponseType>> {
    if (!payload.events.length) {
      return err(400, "Brak wydarzeń do opublikowania.");
    }

    const normalizedEvents = [...payload.events].sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime(),
    );

    const stateGroups: StateGroup[] =
      groupInstagramCarouselEventsByState(normalizedEvents);

    const hashtags = buildInstagramCarouselHashtags(
      normalizedEvents,
      stateGroups.map((group) => group.state),
    );
    const caption = buildInstagramCarouselCaption(
      { ...payload, events: normalizedEvents },
      stateGroups,
      hashtags,
    );

    try {
      const generatedSlides = await generateInstagramCarouselSlides(
        { ...payload, events: normalizedEvents },
        stateGroups,
      );

      const publicBaseUrl = resolveInstagramCarouselPublicBaseUrl(
        payload.publicBaseUrl,
      );

      const uploadedSlidesResults = await Promise.all(
        generatedSlides.map((slide) =>
          uploadInstagramCarouselSlide(slide, publicBaseUrl),
        ),
      );

      const failedUpload = uploadedSlidesResults.find(
        (result) => !result.success,
      );
      if (failedUpload && !failedUpload.success) {
        return failedUpload;
      }

      const uploadedSlides = uploadedSlidesResults
        .filter(
          (result): result is { success: true; data: UploadedGeneratedSlide } =>
            result.success,
        )
        .map((result) => result.data);

      if (payload.dryRun) {
        return ok({
          caption,
          hashtags,
          aspectRatio: INSTAGRAM_CAROUSEL_ASPECT_RATIO,
          eventCount: normalizedEvents.length,
          stateCount: stateGroups.length,
          dryRun: true,
          slides: uploadedSlides.map(({ buffer, ...slide }) => slide),
          carouselContainerId: null,
          publishedMediaId: null,
        });
      }

      const credentials = resolveInstagramGraphCredentials(payload);
      if (!credentials) {
        return err(
          500,
          "Brakuje INSTAGRAM_BUSINESS_ACCOUNT_ID lub FACEBOOK_GRAPH_ACCESS_TOKEN.",
        );
      }

      const publishResult = await FacebookGraphService.publishInstagramCarousel(
        {
          caption,
          slideUrls: uploadedSlides.map((slide) => slide.publicUrl),
          credentials,
        },
      );

      if (!publishResult.success) {
        return publishResult;
      }

      const slidesWithContainers = uploadedSlides.map(
        ({ buffer, ...slide }, index) => ({
          ...slide,
          itemContainerId: publishResult.data.itemContainerIds[index],
        }),
      );

      return ok({
        caption,
        hashtags,
        aspectRatio: INSTAGRAM_CAROUSEL_ASPECT_RATIO,
        eventCount: normalizedEvents.length,
        stateCount: stateGroups.length,
        dryRun: false,
        slides: slidesWithContainers,
        carouselContainerId: publishResult.data.carouselContainerId,
        publishedMediaId: publishResult.data.publishedMediaId,
      });
    } catch (error) {
      console.error("Failed to publish weekly Instagram carousel:", error);
      return err(
        500,
        "Nie udało się wygenerować lub opublikować instagramowej karuzeli.",
      );
    }
  }
}
