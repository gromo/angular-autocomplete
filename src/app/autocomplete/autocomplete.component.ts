import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

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

    isFocused: boolean = false;
    matches: string[] = [];
    selectedIndex: number = -1;
    value: string = '';

    getMatches(value: string): string[] {
        if (!this.source || value == null || value.length < this.minlength) {
            return [];
        }
        if (this.source instanceof Array) {
            value = value.toLowerCase();
            return this.source.filter(v => v.toLowerCase().match(value));
        }
        if (this.source instanceof Function) {
            let result = this.source(value);
            if (result instanceof Array) {
                return result;
            }
            if (result instanceof Observable) {
                result.subscribe(data => {
                    if (this.isFocused && this.value === value) {
                        this.matches = data;
                        this.selectedIndex = -1;
                    }
                });
            }
        }
        return [];
    }

    hideMatches(): void {
        this.matches = [];
        this.selectedIndex = -1;
    }

    onBlur(): void {
        this.isFocused = false;

        // timeout required to handle click on matches
        setTimeout(() => this.hideMatches(), 100);
    }

    onChange(value: any): void {
        this.select(value);
        this.matches = this.getMatches(value);
        this.selectedIndex = -1;
    };

    onFocus(): void {
        this.isFocused = true;
    }

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
                    this.hideMatches();
                    break;
            }
        }
    }

    propagateValue = (_: any) => {};

    registerOnChange(fn: (_: any) => void): void {
        this.propagateValue = fn;
    }

    registerOnTouched(fn: () => void): void {}

    select(value: string, hideMatches?: boolean): void {
        this.propagateValue(value);
        this.value = value;

        if (hideMatches) {
            this.hideMatches();
        }
    }

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
            this.select(this.matches[index]);
        }
    }

    writeValue(value: any): void {
        if (value == null) {
            value = '';
        }
        this.value = value;
    }
}