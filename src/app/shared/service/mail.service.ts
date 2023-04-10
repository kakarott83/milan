import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { Travel } from 'src/app/models/travel';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { Injectable } from '@angular/core';

import { Spend } from '../../models/spend';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(private http: HttpClient) {}

  sendMail(travels: Travel[], uploads?: any[]) {
    const senderName = 'Michael Lange';

    const url = 'http://localhost:5000/api/user/sendMail';
    const body = {
      sender: 'michael@milan-muc.de',
      senderName: senderName,
      receiver: 'michael@milan-muc.de',
      receiverName: 'Verwaltung',
      subject: 'Reisekostenabrechnung',
      html: '',
    };

    body.html = this.createHtml(travels, senderName, uploads);

    console.log(body, 'sendMailBody');
    // try {
    //   this.http.post(url, body).subscribe((data) => {
    //     console.log(data, 'SendMail');
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  }

  createHtml(json, senderName, uploads?) {
    console.log(json, 'Json');
    console.log(uploads, 'Uploads');

    let uploadList = '';
    if (uploads !== undefined && uploads.lenght > 0) {
      let items = '';
      for (let index = 0; index < uploads.length; index++) {
        const element = uploads[index];
        items +=
          '<li><a href="' + element.url + '>' + element.name + '</a></li>';
      }
      uploadList = '<ul>' + items + '</ul>';
    }

    console.log(uploadList, 'UploadList');

    let table =
      '<h2>Reisekostenübersicht</h2></br>' +
      '<h2>' +
      senderName +
      '</h2></br><table style="font-family: arial, sans-serif; width: 100%;border-collapse: collapse;">';

    table +=
      '<tr><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Zeitraum</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Kunde</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Ort</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Zweck</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Ausgaben</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Belege</th></tr>';

    let subTableSpend = '';

    for (let index = 0; index < json.length; index++) {
      var travel = json[index];
      const link =
        'https://firebasestorage.googleapis.com/v0/b/milan-adf44.appspot.com/o/test%2F1677404487899_0340-1650-2012-11-583.pdf?alt=media&token=baa56963-e265-4e79-adce-afc237b08ceb';

      if (travel.spend.length > 0) {
        subTableSpend =
          '<table style="font-family: arial, sans-serif; width: 100%;border-collapse: collapse;">';

        subTableSpend +=
          '<tr><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Datum</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Art</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Betrag</th></tr>';

        for (
          let spendIndex = 0;
          spendIndex < travel.spend.length;
          spendIndex++
        ) {
          const spend = travel.spend[spendIndex];

          console.log(spend, 'spend');

          subTableSpend +=
            '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
            moment(spend.date).format('DD.MM.YYYY HH:mm') +
            '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
            spend.type +
            '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
            spend.value +
            '€' +
            '</td></tr>';
        }

        subTableSpend += '</table>';
      } else {
        subTableSpend = '';
      }

      table +=
        '<tr><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        moment(travel.start).format('DD.MM.YYYY HH:mm') +
        ' - ' +
        moment(travel.end).format('DD.MM.YYYY HH:mm') +
        '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        travel.customer.name +
        '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        travel.customer.city +
        '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        travel.reason +
        '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        subTableSpend +
        '</td><td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' +
        '<a href=' +
        uploadList +
        '>Belege</a></td></tr>';
    }

    table += '</table></table></br><p>Schöne Grüße</p></br>' + senderName;

    return table;
  }
}
