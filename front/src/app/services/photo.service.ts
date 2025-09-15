import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root',
})
export class PhotoService {

	constructor(private http: HttpClient) { }

	getImages() {
		return this.http.get<any>('assets/demo/data/photos.json')
			.toPromise()
			.then(res => res.data)
			.then(data => data);
	}
}
