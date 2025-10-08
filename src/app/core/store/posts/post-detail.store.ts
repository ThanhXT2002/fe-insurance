import { BaseStoreSignal } from "@/core/base/base-store-signal";
import { PostItem } from "@/core/interfaces/post.interface";
import { Injectable } from "@angular/core";

interface PostDetailEntry {
  data: PostItem | null;
  fetchedAt: number;
  accessingAt: number;
}


interface PostDetailState {
  entries: Record<string, PostDetailEntry>;
}

@Injectable({ providedIn: 'root' })
export class PostDetailStore extends BaseStoreSignal<PostDetailState> {
  protected getInitialState(): PostDetailState {
    return { entries: {} };
  }
}
