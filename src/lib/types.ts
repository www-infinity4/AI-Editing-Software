export type EditorMode = "video" | "game";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Object URL for preview
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type JobStatus = "idle" | "queued" | "processing" | "done" | "error";

export interface ProcessingJob {
  id: string;
  status: JobStatus;
  progress: number; // 0-100
  message: string;
  outputUrl?: string;
  outputName?: string;
  createdAt: Date;
}

export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  mode: EditorMode;
  fileNames: string[];
}

export interface ChatResponse {
  message: string;
  ready: boolean; // true when AI is ready to start processing
}

export interface ProcessRequest {
  mode: EditorMode;
  fileIds: string[];
  instructions: string;
}

export interface ProcessResponse {
  jobId: string;
  status: JobStatus;
  message: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  progress: number;
  message: string;
  outputUrl?: string;
  outputName?: string;
}
