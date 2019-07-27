import {NgModule} from '@angular/core'
import { ScrollVanishDirective } from './scroll-vanish.directive';
@NgModule({
    declarations:[ScrollVanishDirective],
    exports:[ScrollVanishDirective]
})
export class DirectiveModule{}