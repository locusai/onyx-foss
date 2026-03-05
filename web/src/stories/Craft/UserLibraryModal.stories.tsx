import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";

import UserLibraryModal from "@/app/craft/v1/configure/components/UserLibraryModal";
import type {
  CreateDirectoryRequest,
  LibraryEntry,
  UploadResponse,
} from "@/app/craft/types/user-library";

const FIXED_NOW_ISO = "2026-03-02T00:00:00.000Z";

function stubDirectory(params: { id: string; name: string; path: string }): LibraryEntry {
  return {
    id: params.id,
    name: params.name,
    path: params.path,
    is_directory: true,
    file_size: null,
    mime_type: null,
    sync_enabled: true,
    created_at: FIXED_NOW_ISO,
    children: [],
  };
}

function stubFile(params: {
  id: string;
  name: string;
  path: string;
  mimeType?: string | null;
  size?: number | null;
}): LibraryEntry {
  return {
    id: params.id,
    name: params.name,
    path: params.path,
    is_directory: false,
    file_size: params.size ?? 1024,
    mime_type: params.mimeType ?? "application/octet-stream",
    sync_enabled: true,
    created_at: FIXED_NOW_ISO,
  };
}

function StoryFrame() {
  const [open, setOpen] = useState(true);
  return (
    <div className="h-screen w-screen bg-background p-4">
      <UserLibraryModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

const meta = {
  title: "Craft/User Library Modal",
  render: () => <StoryFrame />,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const EMPTY_ENTRIES: LibraryEntry[] = [];
const WITH_FILES_ENTRIES: LibraryEntry[] = [
  stubDirectory({
    id: "dir-marketing",
    name: "Marketing",
    path: "user_library/Marketing",
  }),
  stubFile({
    id: "file-brief",
    name: "brief.pdf",
    path: "user_library/Marketing/brief.pdf",
    mimeType: "application/pdf",
    size: 44321,
  }),
  stubDirectory({
    id: "dir-engineering",
    name: "Engineering",
    path: "user_library/Engineering",
  }),
  stubFile({
    id: "file-design-doc",
    name: "design.md",
    path: "user_library/Engineering/design.md",
    mimeType: "text/markdown",
    size: 9123,
  }),
  stubFile({
    id: "file-notes",
    name: "notes.txt",
    path: "user_library/notes.txt",
    mimeType: "text/plain",
    size: 2150,
  }),
];

function buildUserLibraryHandlers(entries: LibraryEntry[]) {
  return [
    http.get("/api/build/user-library/tree", () => HttpResponse.json(entries)),
    http.post("/api/build/user-library/upload", () =>
      HttpResponse.json(
        {
          entries: [],
          total_uploaded: 0,
          total_size_bytes: 0,
        } satisfies UploadResponse,
        { status: 200 },
      ),
    ),
    http.post("/api/build/user-library/upload-zip", () =>
      HttpResponse.json(
        {
          entries: [],
          total_uploaded: 0,
          total_size_bytes: 0,
        } satisfies UploadResponse,
        { status: 200 },
      ),
    ),
    http.post(
      "/api/build/user-library/directories",
      async ({ request }) => {
        const json = (await request.json()) as CreateDirectoryRequest;
        const dir = stubDirectory({
          id: `dir-${json.name}`,
          name: json.name,
          path: `user_library/${json.name}`,
        });
        return HttpResponse.json(dir);
      },
    ),
    http.patch("/api/build/user-library/files/:documentId/toggle", () => {
      return new HttpResponse(null, { status: 204 });
    }),
    http.delete("/api/build/user-library/files/:documentId", () => {
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: buildUserLibraryHandlers(EMPTY_ENTRIES),
    },
  },
};

export const WithFiles: Story = {
  parameters: {
    msw: {
      handlers: buildUserLibraryHandlers(WITH_FILES_ENTRIES),
    },
  },
};
