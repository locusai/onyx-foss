import { ChatFileType } from "@/app/app/interfaces"
import {
  UserFileStatus,
  type ProjectFile,
} from "@/app/app/projects/projectsService"

export const storybookRecentFiles = [
  {
    id: "file_storybook_1",
    file_id: "file_storybook_1",
    name: "Product Brief.pdf",
    project_id: null,
    user_id: "user_storybook_1",
    created_at: "2026-02-01T12:00:00.000Z",
    status: UserFileStatus.COMPLETED,
    file_type: "application/pdf",
    last_accessed_at: "2026-02-03T12:00:00.000Z",
    chat_file_type: ChatFileType.DOCUMENT,
    token_count: 1200,
    chunk_count: 42,
  },
] satisfies ProjectFile[]
