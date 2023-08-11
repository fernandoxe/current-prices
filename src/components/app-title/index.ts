import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('app-title')
export class AppTitle extends LitElement {
  static styles = css`
    h5 {
      margin: 0;
    }
  `;

  @property()
  name = 'Asd';

  render() {
    return html`
      <h5>Elegí un sector para ver los precios generales y VIP</h5>
    `;
  }
}
