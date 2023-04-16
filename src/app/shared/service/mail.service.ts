import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { Docs } from 'src/app/models/doc';
import { Travel } from 'src/app/models/travel';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { Injectable } from '@angular/core';

import { NameValidation } from '../../auth/validators';
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

    body.html = this.createHtml(travels, senderName);

    console.log(body, 'sendMailBody');
    // try {
    //   this.http.post(url, body).subscribe((data) => {
    //     console.log(data, 'SendMail');
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  }

  createHtml(json, senderName) {
    console.log(json, 'Json');

    // let uploadList: json.urls.name;
    // if (uploadList !== undefined && uploadList.lenght > 0) {
    //   let items = '';
    //   for (let index = 0; index < uploadList.length; index++) {
    //     const element = uploadList[index];
    //     items +=
    //       '<li><a href="' + element.url + '>' + element.name + '</a></li>';
    //   }
    //   uploadList = '<ul>' + items + '</ul>';
    // }

    let table =
      '<h2>Reisekostenübersicht</h2></br>' +
      '<h2>' +
      senderName +
      '</h2></br><table style="font-family: arial, sans-serif; width: 100%;border-collapse: collapse;">';

    table +=
      '<tr><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Zeitraum</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Kunde</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Ort</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Zweck</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Ausgaben</th><th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Belege</th></tr>';

    let subTableSpend = '';

    for (let index = 0; index < json.length; index++) {
      let travel = json[index];
      let urls: Docs[] = travel.urls;
      let urlsText = '';
      console.log(travel.urls, 'Urls');

      if (urls.length > 0) {
        urlsText = '<ul>';
      }
      for (let index = 0; index < urls.length; index++) {
        const element = urls[index];
        urlsText +=
          '<li><a href="' + element.url + '">' + element.name + '</a></li>';
      }
      if (urls.length > 0) {
        urlsText += '</ul>';
      }

      console.log(urlsText, 'urlsText');

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
        urlsText +
        '</td></tr>';
    }

    table += '</table></table></br><p>Schöne Grüße</p></br>' + senderName;

    return table;
  }
}
