import * as bootstrap from 'bootstrap';
import { Component,OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { FormBuilder,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { eventData } from './events.components.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone : false,
  providers :[FormBuilder,Validators,CommonModule]
})

export class EventsComponent implements OnInit 
{

  events : any[] = [];
  public fbobj = new FormBuilder();
  public formData : eventData = new eventData;
  public seatBtn = true;

  public id : number = 0 ;
  public GoLang : number = 0;
  public PythonMl: number = 0;
  public Ml : number = 0;
  public IPhoneProgramming : number = 0;
  public AndroidProgramming: number = 0;
  public WebDevelopment : number = 0;
  public batchName : String = "Batch";
  public objId : number = 0;

  constructor(private _eventService: EventService) { }

  eventForm = this.fbobj.group
  ({
    Firstname :['',[Validators.required,Validators.minLength(5),Validators.pattern('^[a-zA-Z ]+$')]],
    phone :['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
    email : ['', [Validators.required,Validators.email] ],
    address : ['', [Validators.required]]
  });

  count() : void
  {
    this._eventService.countObject().subscribe(res =>{this.objId = res.count;});
  }

  clearForm() : any
  {
    return this.eventForm.reset();
  }

  isFornValid() : any
  {
    return this.eventForm.valid;
  }

  getEventname(name : any) : void
  {
      
    this.batchName = name;
    
    this._eventService.countBatches().subscribe(res => {
    this.GoLang = res.GoLang;
    this.AndroidProgramming = res.AndroidProgramming;
    this.PythonMl = res.PythonML;
    this.Ml = res.MachineLearning;
    this.WebDevelopment = res.WebDevelopment;
    this.IPhoneProgramming = res.IPhoneProgramming;

    switch (name) 
    {
      case "Angular: Web Development":
        this.id = this.WebDevelopment;
        if(this.WebDevelopment >=10) 
        {
          this.seatBtn = false;  
        }
        else
        {
          this.seatBtn = true
        }
        break;

      case "Python: Machine Learning":        
        this.id = this.PythonMl;
        if (this.PythonMl>=10) 
        {
          this.seatBtn = false;
        }
        else
        {
          this.seatBtn = true;
        }
        
        break;

        case "Machine Learning":
          this.id = this.Ml;
          if (this.Ml >= 10) 
          {
            this.seatBtn = false;
          }
          else
          {
            this.seatBtn = true
          }
          
          break;

          case "GoLang":
            this.id = this.GoLang;
            if (this.GoLang >= 2) 
            {
              this.seatBtn = false
            }
            else
            {
              this.seatBtn = true
            }
            break;

          case "IPhone Programming":
            this.id = this.IPhoneProgramming
          if (this.IPhoneProgramming >= 10) 
          {
            this.seatBtn = false;
          }
          else
          {
            this.seatBtn = true
          }
          break;

          case "Android Programming":
          this.id = this.AndroidProgramming;
          if (this.AndroidProgramming >= 10) 
          {
            this.seatBtn = false;
          }
          else
          {
            this.seatBtn = true
          }
          break;

        default:
          this.seatBtn = true;
        break;
    }

    const registrationForm = document.getElementById('registrtionForm');
    const batchFull = document.getElementById('BatchFull');
    
    if (registrationForm)
    {     
      const registrationFormmodal = new bootstrap.Modal(registrationForm);
      const batchFullmodal = new bootstrap.Modal(batchFull);

      if(this.seatBtn)
      {
        registrationFormmodal.show();
      }
      else
      {
        batchFullmodal.show();
      }
    }

    this.count();

  });


    return;      
  }

  insertData() : void
  { 
    this.count()

    this.formData.id = String(this.objId+1);
    this.formData.name = this.eventForm.value.Firstname;
    this.formData.email = this.eventForm.value.email;
    this.formData.mobile = this.eventForm.value.phone;
    this.formData.address = this.eventForm.value.address;
    this.formData.batch = String(this.batchName);
    
    this._eventService.eventsubmitForm(this.formData).subscribe(res => {this.eventForm.reset()});

  }

  ngOnInit()
  {   
    this._eventService.getEvents().subscribe(res => this.events = res,err => console.log(err));
    this.count()
  }

}