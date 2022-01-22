const template = document.createElement('template')
template.innerHTML = `
  
  <style>
    svg {
      width: 1em;
    }
    .tooltip-container {
      display: inline-block;
      position: relative;
      z-index: 2;
    }
    .tooltip-container__icon-cancel {
      display: none;
    }
    .tooltip-container__tooltip-notify {
      position: absolute;
      bottom: 125%;
      z-index: 3;
      width: 300px;
      background-color: #ffffff;
      box-shadow: 5px 5px 10px rgba(0,0,0,0.1);
      font-size: .8em;
      border-radius: .5em;
      padding: 1em;
      transform: scale(0);
      transform-origin: bottom left;
      transition: transform .5s cubic-bezier(0.860, 0.000, 0.070, 1.000);
    }
    .tooltip-container__icon-alert, .tooltip-container__icon-cancel {
      cursor: pointer;
    }
  </style>

  <div class='tooltip-container'>
  
    <svg class='tooltip-container__icon-alert' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7Z' fill='#155DC9'/>
      <path d='M5.5 2H8.5L7.5 8H6.5L5.5 2Z' fill='white'/>
      <circle cx='7' cy='10' r='1' fill='white'/>
    </svg>

    <svg class='tooltip-container__icon-cancel' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7Z' fill='#155DC9'/>
      <rect x='4' y='5.03571' width='1.46473' height='8' transform='rotate(-45 4 5.03571)' fill='white'/>
      <rect x='9.65698' y='3.99973' width='1.46473' height='8' transform='rotate(45 9.65698 3.99973)' fill='white'/>
    </svg>
    
    <div class='tooltip-container__tooltip-notify'>
      <slot name='message'></slot>
   </div>

  </div>
`

class PopUpNotify extends HTMLElement {
  constructor() {
    super()
    this.showTooltip = false
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  handleTooltip() {
    const tooltip = this.shadowRoot.querySelector(
      '.tooltip-container__tooltip-notify'
    )
    const alert = this.shadowRoot.querySelector(
      '.tooltip-container__icon-alert'
    )
    const cancel = this.shadowRoot.querySelector(
      '.tooltip-container__icon-cancel'
    )

    if (!this.showTooltip) {
      tooltip.style.transform = 'scale(1)'
      alert.style.display = 'none'
      cancel.style.display = 'block'
      this.showTooltip = true
    } else {
      tooltip.style.transform = 'scale(0)'
      alert.style.display = 'block'
      cancel.style.display = 'none'
      this.showTooltip = false
    }
  }

  connectedCallback() {
    // Alert icon
    this.shadowRoot
      .querySelector('.tooltip-container__icon-alert')
      .addEventListener('click', () => {
        this.handleTooltip()
      })

    // Cancel icon
    this.shadowRoot
      .querySelector('.tooltip-container__icon-cancel')
      .addEventListener('click', () => {
        this.handleTooltip()
      })

    // Applies colors via props
    if (this.getAttribute('bg_color')) {
      this.shadowRoot.querySelector(
        '.tooltip-container__tooltip-notify'
      ).style.backgroundColor = this.getAttribute('bg_color')
    }
    if (this.getAttribute('text_color')) {
      this.shadowRoot.querySelector(
        '.tooltip-container__tooltip-notify'
      ).style.color = this.getAttribute('text_color')
    }

    // Detects click outside web component
    document.addEventListener('click', (event) => {
      if (!event.composedPath().includes(this)) {
        const tooltip = this.shadowRoot.querySelector(
          '.tooltip-container__tooltip-notify'
        )
        const alert = this.shadowRoot.querySelector(
          '.tooltip-container__icon-alert'
        )
        const cancel = this.shadowRoot.querySelector(
          '.tooltip-container__icon-cancel'
        )
        tooltip.style.transform = 'scale(0)'
        alert.style.display = 'block'
        cancel.style.display = 'none'
        this.showTooltip = false
      }
    })
  }
}

window.customElements.define('popup-notify', PopUpNotify)
