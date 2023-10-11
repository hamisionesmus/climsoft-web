import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StationFormModel } from 'src/app/core/models/station-form.model';
import { StationModel } from 'src/app/core/models/station.model';
import { PagesDataService } from 'src/app/core/services/pages-data.service';
import { StationsService } from 'src/app/core/services/stations.service';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {

  showCharacteristics: boolean = true;
  showElements: boolean = false;
  showForms: boolean = false;
  showContacts: boolean = false;
  bAllowSave: boolean = false;
  station!: StationModel;
  forms!: StationFormModel[];

  constructor(
    private pagesDataService: PagesDataService,
    private route: ActivatedRoute,
    private stationsService: StationsService,
  ) {
    this.pagesDataService.setPageHeader('Station Detail');
  }

  ngOnInit() {

    const stationId = this.route.snapshot.params['stationid'];

    this.stationsService.getStation(stationId).subscribe((data) => {
      this.station = data;
    });

  }

  loadForms(): void {

    if (!this.forms) {
      this.stationsService.getStationForms(this.station.id).subscribe((data) => {
        this.forms = data;
      });
    }

  }

  getFormIds(): number[] {
    return this.forms.map(form => form.sourceId) ?? [];
  }

  onFormsSelected(selectedIds: number[]): void {

    console.log('posting', selectedIds)
    this.stationsService.saveStationForms(this.station.id, selectedIds).subscribe((data) => {
      this.forms = data;
    });


  }

  onFormDeleteClick(form: StationFormModel): void {

  }


  onSaveClick(): void {

  }

  onCancelClick(): void {

  }







}
