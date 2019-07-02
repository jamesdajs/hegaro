import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from 'angularfire2/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configurl } from './config';

@Injectable({
	providedIn: 'root'
})
export class FotosService {
	private imgCropUrl = []
	constructor(
		private imagePicker: ImagePicker,
		private cropService: Crop,
		private file: File,
		private storage: AngularFireStorage,
		private http: HttpClient
	) { }
	escogerImagenes(cant:number) {
		return this.imagePicker.hasReadPermission()
			.then((result) => {
				if (result == false) {
					// no callbacks required as this opens a popup which returns async    
					return this.imagePicker.requestReadPermission();
				}
				else {
					return this.imagePicker.getPictures({

						maximumImagesCount: cant,
						quality: 10
					})
				}
			})
			.then(async (results) => {
				this.imgCropUrl = []
				for (var i = 0; i < results.length; i++) {
					let cropS = await this.cropService.crop(results[i])
					let pros = await this.procesandoCrop(cropS)
					this.imgCropUrl.push(pros)
				}
				return this.imgCropUrl
			})
	}
	procesandoCrop(imageData) {
		return new Promise((res, rej) => {
			let urlimage: any
			this.file.resolveLocalFilesystemUrl(imageData)
				.then(newurlImage => {
					let dirpath = newurlImage.nativeURL
					let dirpathseg = dirpath.split("/")
					dirpathseg.pop()
					dirpath = dirpathseg.join('/')
					//alert(dirpath)
					urlimage = newurlImage
					return this.file.readAsArrayBuffer(dirpath, newurlImage.name)
				}).then(buffer => {
					//alert(buffer.byteLength)
					let blob = new Blob([buffer], { type: "image/jpg" })

					var reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = function () {
						res({
							base64: reader.result,
							url: urlimage.nativeURL,
							nombre: urlimage.name,
							blob: blob

						})
					}
				})
				.catch(err => rej(err))
		})


	}
	getimagenesblob() {
		return this.imgCropUrl
	}
	uploadImageToFirebase(path, objres) {
		return new Promise((resolve, reject) => {
			//alert(newUrl)
			let ref = this.storage.ref(path + objres.nombre)
			let task = ref.put(objres.blob)
			task.snapshotChanges().pipe(
				finalize(() => {
					ref.getDownloadURL().subscribe(data => {
						//alert(data);
						resolve(data)
					})

				})
			).subscribe(() => { }, err => reject(err))

		})
	}
	headers = new HttpHeaders()
	urlsaveImg = Configurl.url +"usuarios/saveimg"
	urlupdateImg = Configurl.url +"usuarios/updateimg"
	urldeleteImg = Configurl.url +"usuarios/deleteimg"
	subirimagen(foto: Blob, carpeta: string, index: string):Promise<any> {
		//this.headers=this.headers.append('Content-Type', 'multipart/form-data')
		const formData = new FormData();
		formData.append('file', foto);
		formData.append('dir', carpeta);
		formData.append('aux', index);
		return this.http.post(this.urlsaveImg, formData).toPromise()
	}
	modificarimagen(foto: Blob, carpeta: string, nombre: string):Promise<any> {
		//this.headers=this.headers.append('Content-Type', 'multipart/form-data')
		const formData = new FormData();
		formData.append('file', foto);
		formData.append('dir', carpeta);
		formData.append('nombre', nombre);
		return this.http.post(this.urlupdateImg, formData).toPromise()
	}
	eliminarImagen(nombre,carpeta){
		return this.http.post<boolean>(this.urldeleteImg, {nombre:nombre,dir:carpeta}).toPromise()
	}
	smallImg
	smallSize
	createThumbnail(base64) {
		return this.generateFromImage(base64, 200, 200, 0.5)
		.then( data => {
			this.smallImg = data;
			this.smallSize = this.getImageSize(this.smallImg);
			return {base64:data,size:this.getImageSize(this.smallImg),blob:this.dataURItoBlob(data)}
		});
	}

	generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1):Promise<string>{
		return new Promise((resolve,reject)=>{

			var canvas: any = document.createElement("canvas");
			var image = new Image();
	
			image.onload = () => {
				var width = image.width;
				var height = image.height;
	
				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}
				canvas.width = width;
				canvas.height = height;
				var ctx = canvas.getContext("2d");
	
				ctx.drawImage(image, 0, 0, width, height);
	
				// IMPORTANT: 'jpeg' NOT 'jpg'
				var dataUrl = canvas.toDataURL('image/jpeg', quality);
	
				resolve(dataUrl)
			}
			image.src = img;
		})
	}

	getImageSize(data_url) {
		var head = 'data:image/jpeg;base64,';
		return ((data_url.length - head.length) * 3 / 4 / (1024 * 1024)).toFixed(4);
	}
	dataURItoBlob(dataURI) {
		// convert base64 to raw binary data held in a string
		var byteString = atob(dataURI.split(',')[1]);
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
		}
		// write the ArrayBuffer to a blob, and you're done

		var bb = new Blob([ab]);
		return bb;
		}
	
}
