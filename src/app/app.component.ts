import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

const MOVIES: string[] = [
    'The Commuter',
    'Avengers: Infinity War',
    '12 Strong',
    'Black Panther',
    'Insidious: The Last Key',
    'Den of Thieves',
    'Proud Mary',
    'Red Sparrow',
    'Tomb Raider',
    'Solo: A Star Wars Story',
    'Venom',
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    movies = MOVIES;

    optionsArray = {
        minlength: 1,
        search: '',
        source: MOVIES
    };

    optionsCallback = {
        minlength: 2,
        search: '',
        source: (value: string) => {
            value = value.toLowerCase();
            return MOVIES.filter(v => v.toLowerCase().match(value));
        }
    };

    optionsObservable = {
        minlength: 2,
        search: '',
        source: (value: string) => {
            var result = new Observable(observer => {
                setTimeout(() => {
                    value = value.toLowerCase();
                    observer.next(MOVIES.filter(v => v.toLowerCase().match(value)));
                }, 500);
            });
            return result;
        }
    };

    title: string = 'Autocomplete Component';
}
