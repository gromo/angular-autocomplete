import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    search = '';
    title = 'Autocomplete Component';

    movies: string[] = [
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
}
