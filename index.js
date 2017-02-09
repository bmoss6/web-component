


"use strict";

const template = `
<form id="formit">
<input id= "searchit" type="text" name="search" placeholder="Search..">
<button id ="searchbut">Search</button>
</form>
    `;

class SearchBtn extends HTMLElement {


  // A getter/setter for searchit.
          get value() {
            return  this.shadowRoot.querySelector('#searchit').value
          }

          set value(value) {
             this.shadowRoot.querySelector('#searchit').value = value;
             this.setAttribute('value',value);
          }




   constructor() {

        super();
       let shadowRoot = this.attachShadow({mode: 'open'});
       shadowRoot.innerHTML = template;



       const mycomponent = this;

      this.shadowRoot.querySelector('form').addEventListener('submit',function (e){
          e.preventDefault();
          console.log(mycomponent.shadowRoot.querySelector('#searchit').value)
          mycomponent.shadowRoot.querySelector('#searchit').value ="";
       });
   }




}
window.customElements.define("search-input", SearchBtn);
