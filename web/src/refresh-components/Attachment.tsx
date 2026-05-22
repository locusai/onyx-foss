import Text from "@/refresh-components/texts/Text";
import Button from "@/refresh-components/buttons/Button";
import {
  ExpandTwoIcon,
  FileIcon,
  TriangleAlertIcon,
} from "@/components/icons/icons";
import { cn } from "@/lib/utils";

export type AttachmentVariant = "document" | "unavailable";

export interface AttachmentsProps {
  fileName: string;
  open?: () => void;
  variant?: AttachmentVariant;
}

export default function Attachments({
  fileName,
  open,
  variant = "document",
}: AttachmentsProps) {
  const isUnavailable = variant === "unavailable";

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-12 border bg-background-tint-00 p-1",
        isUnavailable && "border-dashed"
      )}
    >
      <div className="p-2 bg-background-tint-01 rounded-08">
        {isUnavailable ? (
          <TriangleAlertIcon className="h-[1.25rem] w-[1.25rem] text-text-03" />
        ) : (
          <FileIcon className="h-[1.25rem] w-[1.25rem] text-text-03" />
        )}
      </div>
      <div className="flex min-w-0 flex-col px-2">
        <Text as="p" secondaryAction className="break-all">
          {fileName}
        </Text>
        <Text as="p" secondaryBody text03>
          {isUnavailable ? "Unavailable in history" : "Document"}
        </Text>
      </div>

      {open && (
        <Button
          aria-label="Expand document"
          onClick={open}
          rightIcon={ExpandTwoIcon}
          tertiary
          size="md"
        />
      )}
    </div>
  );
}
