class GreetingComponent extends HTMLElement {
    constructor() {
        super(); // Call the parent constructor 
        // Attach a shadow root to the element to encapsulate styles and markup
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Whenever the element is added to the DOM, this will run
        const name = this.getAttribute('name') || 'World';

        // Create the HTML structure
        this.shadowRoot.innerHTML = `
      <style>
        div {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          color: #333;
          text-align: center;
        }
      </style>
      <div>Hello, ${name}!</div>
    `;
    }
}

// Define the custom element
customElements.define('greeting-component', GreetingComponent);
