import React from "react";
import MenuItemForm from "main/components/MenuItems/MenuItemForm";
import { MenuItemFixtures } from "fixtures/MenuItemFixtures";

export default {
  title: "components/MenuItems/MenuItem",
  component: MenuItemForm,
};

const Template = (args) => {
  return <MenuItemForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: MenuItemFixtures.oneMenuItem,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
