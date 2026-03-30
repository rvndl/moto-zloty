import { err, ok, type ServiceResult } from "./types";

const DEFAULT_GRAPH_API_VERSION = "v23.0";
const DEFAULT_POLL_INTERVAL_MS = 2_000;
const DEFAULT_MAX_POLL_ATTEMPTS = 15;

interface FacebookGraphErrorPayload {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

interface MediaContainerResponse {
  id: string;
}

interface MediaStatusResponse {
  status_code?: string;
}

export interface InstagramGraphCredentials {
  instagramAccountId: string;
  accessToken: string;
  apiVersion?: string;
}

export interface PublishInstagramCarouselInput {
  slideUrls: string[];
  caption: string;
  credentials: InstagramGraphCredentials;
}

export interface PublishInstagramCarouselResult {
  itemContainerIds: string[];
  carouselContainerId: string;
  publishedMediaId: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export abstract class FacebookGraphService {
  private static buildApiUrl(
    path: string,
    apiVersion = DEFAULT_GRAPH_API_VERSION,
  ) {
    return `https://graph.instagram.com/${apiVersion}${path}`;
  }

  private static async postForm<T>(
    path: string,
    body: Record<string, string>,
    credentials: InstagramGraphCredentials,
  ): Promise<ServiceResult<T>> {
    try {
      const response = await fetch(
        this.buildApiUrl(
          path,
          credentials.apiVersion ?? DEFAULT_GRAPH_API_VERSION,
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            ...body,
            access_token: credentials.accessToken,
          }),
        },
      );

      const payload = (await response.json()) as T & FacebookGraphErrorPayload;

      if (!response.ok || payload.error) {
        return err(
          response.status || 500,
          payload.error?.message ?? "Facebook Graph API request failed.",
        );
      }

      return ok(payload as T);
    } catch (error) {
      console.error("Facebook Graph API POST failed:", error);
      return err(500, "Nie udało się połączyć z Facebook Graph API.");
    }
  }

  private static async getJson<T>(
    path: string,
    query: Record<string, string>,
    credentials: InstagramGraphCredentials,
  ): Promise<ServiceResult<T>> {
    try {
      const url = new URL(
        this.buildApiUrl(
          path,
          credentials.apiVersion ?? DEFAULT_GRAPH_API_VERSION,
        ),
      );

      Object.entries({
        ...query,
        access_token: credentials.accessToken,
      }).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const response = await fetch(url);
      const payload = (await response.json()) as T & FacebookGraphErrorPayload;

      if (!response.ok || payload.error) {
        return err(
          response.status || 500,
          payload.error?.message ?? "Facebook Graph API request failed.",
        );
      }

      return ok(payload as T);
    } catch (error) {
      console.error("Facebook Graph API GET failed:", error);
      return err(500, "Nie udało się odczytać statusu kontenera Instagram.");
    }
  }

  static async createCarouselItemContainer(
    imageUrl: string,
    credentials: InstagramGraphCredentials,
  ): Promise<ServiceResult<string>> {
    const response = await this.postForm<MediaContainerResponse>(
      `/${credentials.instagramAccountId}/media`,
      {
        image_url: imageUrl,
        is_carousel_item: "true",
      },
      credentials,
    );

    if (!response.success) {
      return response;
    }

    return ok(response.data.id);
  }

  static async waitForContainerReady(
    containerId: string,
    credentials: InstagramGraphCredentials,
    maxAttempts = DEFAULT_MAX_POLL_ATTEMPTS,
    intervalMs = DEFAULT_POLL_INTERVAL_MS,
  ): Promise<ServiceResult<{ id: string; statusCode: string }>> {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const response = await this.getJson<MediaStatusResponse>(
        `/${containerId}`,
        { fields: "status_code" },
        credentials,
      );

      if (!response.success) {
        return response;
      }

      const statusCode = response.data.status_code ?? "FINISHED";

      if (statusCode === "FINISHED" || statusCode === "PUBLISHED") {
        return ok({ id: containerId, statusCode });
      }

      if (statusCode === "ERROR" || statusCode === "EXPIRED") {
        return err(
          500,
          `Kontener Instagram ${containerId} zwrócił status ${statusCode}.`,
        );
      }

      await sleep(intervalMs);
    }

    return err(
      504,
      `Instagram nie przygotował kontenera ${containerId} na czas.`,
    );
  }

  static async createCarouselContainer(
    itemContainerIds: string[],
    caption: string,
    credentials: InstagramGraphCredentials,
  ): Promise<ServiceResult<string>> {
    const response = await this.postForm<MediaContainerResponse>(
      `/${credentials.instagramAccountId}/media`,
      {
        media_type: "CAROUSEL",
        children: itemContainerIds.join(","),
        caption,
      },
      credentials,
    );

    if (!response.success) {
      return response;
    }

    return ok(response.data.id);
  }

  static async publishCarousel(
    carouselContainerId: string,
    credentials: InstagramGraphCredentials,
  ): Promise<ServiceResult<string>> {
    const response = await this.postForm<MediaContainerResponse>(
      `/${credentials.instagramAccountId}/media_publish`,
      {
        creation_id: carouselContainerId,
      },
      credentials,
    );

    if (!response.success) {
      return response;
    }

    return ok(response.data.id);
  }

  static async publishInstagramCarousel(
    input: PublishInstagramCarouselInput,
  ): Promise<ServiceResult<PublishInstagramCarouselResult>> {
    if (!input.slideUrls.length) {
      return err(400, "Brak slajdów do wysłania do Instagrama.");
    }

    const itemContainerIds: string[] = [];

    for (const slideUrl of input.slideUrls) {
      const itemContainer = await this.createCarouselItemContainer(
        slideUrl,
        input.credentials,
      );

      if (!itemContainer.success) {
        return itemContainer;
      }

      itemContainerIds.push(itemContainer.data);
    }

    for (const itemContainerId of itemContainerIds) {
      const readyResult = await this.waitForContainerReady(
        itemContainerId,
        input.credentials,
      );

      if (!readyResult.success) {
        return readyResult;
      }
    }

    const carouselContainer = await this.createCarouselContainer(
      itemContainerIds,
      input.caption,
      input.credentials,
    );

    if (!carouselContainer.success) {
      return carouselContainer;
    }

    const carouselReady = await this.waitForContainerReady(
      carouselContainer.data,
      input.credentials,
    );

    if (!carouselReady.success) {
      return carouselReady;
    }

    const publishedMedia = await this.publishCarousel(
      carouselContainer.data,
      input.credentials,
    );

    if (!publishedMedia.success) {
      return publishedMedia;
    }

    return ok({
      itemContainerIds,
      carouselContainerId: carouselContainer.data,
      publishedMediaId: publishedMedia.data,
    });
  }
}
