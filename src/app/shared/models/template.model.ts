export class Template {
     id : string;
     subject: string;
     template : string;
     templateName : string;
     templateType: string;
     type : string;

    constructor(id : string,subject: string,template : string,templateName : string,templateType: string,type : string){
        this.id = id;
        this.subject = subject;
        this.template = template;
        this.templateName = templateName;
        this.templateType = templateType;
        this.type = type;
    }

}
