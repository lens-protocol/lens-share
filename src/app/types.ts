import { Brand } from "@lens-protocol/shared-kernel";

export enum PlatformType {
  Web = "web",
  Mobile = "mobile",
}

export enum RouteKind {
  Home = "home",
  Profile = "profile",
  Publication = "publication",
}

export enum SelectionMode {
  JustOnce = "justOnce",
  Always = "always",
}

export type SearchParams = {
  by?: string;
};

export type AppId = Brand<string, "AppId">;
