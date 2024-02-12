import React, { Component } from "react";

import { DivTabs, TabList, TabContent } from "./styles";
import Tab from "../Tab";

export default class Tabs extends Component {
  state = {
    activeTab: ""
  };

  onClickTabItem = tab => {
    const { activeTab } = this.state;
    if (tab === activeTab) {
      tab = "";
    }
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;
    const children = this.props.children;

    return (
      <DivTabs>
        <TabList>
          {React.Children.map(children, child => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={this.onClickTabItem}
              />
            );
          })}
        </TabList>
        <TabContent className={activeTab === "" ? "hide" : ""}>
          {React.Children.map(children, child => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
        </TabContent>
      </DivTabs>
    );
  }

  // render() {
  //   const { activeTab } = this.state;

  //   return (
  //     <DivTabs>
  //       <TabList>
  //         {this.props.children.map(child => {
  //           const { label } = child.props;

  //           return (
  //             <Tab
  //               activeTab={activeTab}
  //               key={label}
  //               label={label}
  //               onClick={this.onClickTabItem}
  //             />
  //           );
  //         })}
  //       </TabList>
  //       <TabContent className={activeTab === "" ? "hide" : ""}>
  //         {this.props.children.map(child => {
  //           if (child.props.label !== activeTab) return undefined;
  //           return child.props.children;
  //         })}
  //       </TabContent>
  //     </DivTabs>
  //   );
  // }
}
