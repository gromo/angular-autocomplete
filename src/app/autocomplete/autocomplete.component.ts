import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent)
        }
    ],
    selector: 'app-autocomplete',
    styleUrls: ['./autocomplete.component.css'],
    templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent implements ControlValueAccessor {

    @Input() minlength: number = 1;
    @Input() source: any;

    matches: string[] = [];
    selectedIndex: number = -1;
    value: string = '';

    getMatches(value: any): string[] {
        // load items for autocomplete
        if (!this.source || value == null || value.length < this.minlength) {
            return [];
        }
        value = value.toLowerCase();
        return this.source.filter(v => v.toLowerCase().match(value));
    }

    onChange = (value: any) => {
        // propagate value to parent component via ngModel
        this.propagateValue(value);

        this.matches = this.getMatches(value);
        this.selectedIndex = -1;
        this.value = value;
    };

    onKeyDown(event: any): void {
        if (event) {
            switch (event.key) {
                case 'ArrowDown':
                    this.selectByIndex(this.selectedIndex + 1);
                    break;
                case 'ArrowUp':
                    this.selectByIndex(this.selectedIndex - 1);

                    // disable moving cursor to the beginning of input
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    break;
                case 'Enter':
                    // hide autocomplete container
                    this.matches = [];
                    this.selectedIndex = -1;
                    break;
            }
        }
    }

    propagateValue = (_: any) => {};

    registerOnChange(fn: (_: any) => void): void {
        this.propagateValue = fn;
    }

    registerOnTouched(fn: () => void): void {}

    selectByIndex(index: number): void {
        if (index >= this.matches.length) {
            index = this.matches.length - 1;
        }
        if (index < -1) {
            index = -1;
        }
        this.selectedIndex = index;

        // do not erase value if index = -1
        if (this.matches[index] != null) {
            this.value = this.matches[index];
            this.propagateValue(this.value);
        }
    }

    writeValue(value: any): void {
        if (value == null) {
            value = '';
        }
        this.value = value;
    }
}