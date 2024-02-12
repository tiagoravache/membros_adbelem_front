import React, { Component } from "react";

import { TabListItem } from "./styles";

export default class Tab extends Component {
  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label }
    } = this;

    return (
      <TabListItem
        className={activeTab === label ? "tab-list-active" : ""}
        onClick={onClick}
      >
        {label}
      </TabListItem>
    );
  }
}
