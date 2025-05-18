import { Dialog } from "@components";
import { getFilePath } from "@utils/index";
import { Event } from "types/event";

interface Props {
  event?: Event;
}

const BannerPreview = ({ event }: Props) => {
  return (
    <div className="absolute w-20 h-20 overflow-hidden top-5 right-5 md:w-28 md:h-28 rounded-xl">
      <Dialog
        title="Banner"
        description="Banner wydarzenia"
        trigger={
          <img
            src={getFilePath(event?.banner_small_id ?? event?.banner_id)}
            className="z-10 object-cover w-full h-full transition-transform border cursor-pointer rounded-xl hover:scale-105"
            alt={event?.name}
          />
        }
      >
        <img src={getFilePath(event?.banner_id)} />
      </Dialog>
    </div>
  );
};

export { BannerPreview };
