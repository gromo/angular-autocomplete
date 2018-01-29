import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

import {AutocompleteComponent} from './autocomplete.component';

describe('AutocompleteComponent', () => {
    let component: AutocompleteComponent;
    let fixture: ComponentFixture<AutocompleteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AutocompleteComponent],
            imports: [FormsModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AutocompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('defaults', () => {
        expect(component).toBeTruthy();
        expect(component.isFocused).toEqual(false);
        expect(component.matches).toEqual([]);
        expect(component.minlength).toEqual(1);
        expect(component.selectedIndex).toEqual(-1);
        expect(component.source).toBeUndefined();
        expect(component.value).toEqual('');
    });

    // core logic
    it('getMatches: basics', () => {
        expect(component.getMatches(null)).toEqual([]);     // undefined value
        expect(component.getMatches('')).toEqual([]);       // empty value
        expect(component.getMatches('AAA')).toEqual([]);    // no source
    });
    it('getMatches: source as Array', () => {
        component.minlength = 2;
        component.source = getSourceAsArray();

        expect(component.getMatches('a')).toEqual([]);      // minlength
        expect(component.getMatches('aa')).toEqual(['AAA', 'AABB']);
        expect(component.getMatches('Ab')).toEqual(['AABB']);
        expect(component.getMatches('abc')).toEqual([]);    // not found
    });
    it('getMatches: source as Function:Array', () => {
        component.minlength = 2;
        component.source = (value: string) => {
            value = value.toLowerCase();
            return getSourceAsArray().filter(v => v.toLowerCase().match(value));
        };

        expect(component.getMatches('a')).toEqual([]);      // minlength
        expect(component.getMatches('aa')).toEqual(['AAA', 'AABB']);
        expect(component.getMatches('Ab')).toEqual(['AABB']);
        expect(component.getMatches('abc')).toEqual([]);    // not found
    });
    it('getMatches: source as Function:Observable', fakeAsync(() => {
        component.isFocused = true;
        component.minlength = 2;
        component.source = (value: string) => {
            let result = new Observable(observer => {
                setTimeout(() => {
                    value = value.toLowerCase();
                    let result = getSourceAsArray().filter(v => v.toLowerCase().match(value));
                    observer.next(result);
                }, 500);
            });
            return result;
        };

        // minlength check is peformed before check for Observable
        expect(component.getMatches('a')).toEqual([]);      // minlength
        tick(500);
        expect(component.matches).toEqual([]);

        // everything is right when value was not changed
        expect(component.getMatches('aa')).toEqual([]); // empty array for Observable
        component.select('aa');
        tick(500);
        expect(component.matches).toEqual(['AAA', 'AABB']);

        // result shouldn't be applied if value was changed
        expect(component.getMatches('bb')).toEqual([]); // empty array for Observable
        component.matches = ['AAA'];
        component.select('aa');
        tick(500);
        expect(component.matches).toEqual(['AAA']);
    }));

    it('onChange', () => {
        spyOn(component, 'propagateValue');
        component.selectedIndex = 1;
        component.source = getSourceAsArray();

        component.onChange('a');
        expect(component.propagateValue).toHaveBeenCalled();
        expect(component.matches).toEqual(['AAA', 'AABB']);
        expect(component.selectedIndex).toEqual(-1);
        expect(component.value).toEqual('a');
    });

    it('keyboard', () => {
        const compiled = fixture.debugElement.nativeElement;
        const eventEnter = new KeyboardEvent('keydown', {key: 'Enter'});
        const eventKeyDown = new KeyboardEvent('keydown', {key: 'ArrowDown'});
        const eventKeyUp = new KeyboardEvent('keydown', {key: 'ArrowUp'});
        const input = compiled.querySelector('input[type="text"]');

        component.isFocused = true;
        component.source = getSourceAsArray();
        fixture.detectChanges();

        component.onChange('a');
        expect(component.matches).toEqual(['AAA', 'AABB']);
        expect(component.selectedIndex).toEqual(-1);

        spyOn(component, 'propagateValue');
        input.dispatchEvent(eventKeyDown);
        expect(component.propagateValue).toHaveBeenCalled();
        expect(component.selectedIndex).toEqual(0);
        expect(component.value).toEqual('AAA');

        input.dispatchEvent(eventKeyDown);
        expect(component.selectedIndex).toEqual(1);
        expect(component.value).toEqual('AABB');

        // make sure we won't go out of matched elements
        input.dispatchEvent(eventKeyDown);
        expect(component.selectedIndex).toEqual(1);
        expect(component.value).toEqual('AABB');

        input.dispatchEvent(eventKeyUp);
        expect(component.selectedIndex).toEqual(0);
        expect(component.value).toEqual('AAA');

        input.dispatchEvent(eventKeyUp);
        expect(component.selectedIndex).toEqual(-1);
        expect(component.value).toEqual('AAA');

        // make sure we won't go out of matched elements or -1
        input.dispatchEvent(eventKeyUp);
        expect(component.selectedIndex).toEqual(-1);
        expect(component.value).toEqual('AAA');

        input.dispatchEvent(eventEnter);
        expect(component.matches).toEqual([]);
        expect(component.selectedIndex).toEqual(-1);
    });

    function getSourceAsArray() {
        return [
            'AAA',
            'AABB',
            'BBBB',
            'CCCC',
        ];
    }
});