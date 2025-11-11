/**
 * Page Header component types
 */

import * as React from "react";

export type PageHeaderCrumb = {
  label: string;
  href?: string;
};

export type PageHeaderTab = {
  key: string;
  label: string;
};

export type PageHeaderProps = {
  title: string;
  crumbs: PageHeaderCrumb[];
  action?: React.ReactNode;
  className?: string;
  tabs?: PageHeaderTab[];
  activeTab?: string; // controlled
  onTabChange?: (val: string) => void; // fires for both controlled/uncontrolled
  defaultTab?: string; // fallback when URL has no ?tab=
  syncTabWithQuery?: boolean; // default false
  queryKey?: string; // default "tab"
  tabsPosition?: "left" | "right"; // default "left"
  tabsClassName?: string; // custom className for tabs container
};
