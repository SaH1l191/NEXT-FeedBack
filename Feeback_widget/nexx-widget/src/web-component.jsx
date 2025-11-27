import ReactDom from "react-dom/client";
import { Widget } from "./components/Widget";

export const normalizeAttribute = (attribute) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};// just converts the dashes to camel case
//eg: data-attribute becomes dataAttribute for react to process the attribute

class WidgetWebComponent extends HTMLElement {
  constructor() {
    super();//extends the normal html component
    this.attachShadow({ mode: "open" });//new shadow dom which 
    //works seperate as compared to the original dom 
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes();
    //gets the attributes from the custom html elemetn 
    const root = ReactDom.createRoot(this.shadowRoot);
    root.render(<Widget {...props} />);// loads the widget component 
    // props formatted version 
  }

  getPropsFromAttributes() {
    const props = {};
    for (const { name, value } of this.attributes) {
      //This method loops over all attributes of the custom element 
      // (this.attributes) and converts them into an object where 
      // the keys are the normalized prop names (converted to camelCase)
      //  and the values are the attribute values.
      props[normalizeAttribute(name)] = value;
    }
    return props;
  }
}

export default WidgetWebComponent;
