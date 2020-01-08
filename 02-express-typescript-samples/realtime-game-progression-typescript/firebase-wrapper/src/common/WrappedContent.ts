import { Types } from '../identifiers';
import * as _ from 'lodash';

export default class WrappedContent {
    public items: any;
    public questions: any;
    public activities: any;
    private _contentType: Types.ContentTypes;

    constructor(public data: any) {
        this.setContentType(data);
    }

    private setContentType(data: any) {
        // set content type of json based on key check in object
        if (data.contentType) {
            this._contentType = data.contentType;
        } else {
            console.error('unidentified content type. Setting default content type as question');
            this._contentType = Types.ContentTypes.QUESTION;
        }
    }

    public getItems() {
        switch (this._contentType) {
            case Types.ContentTypes.PROGRAM:
                const items = [];
                for (const activity of this.data) {
                    items.push({ ...activity.items, activityId: this.data.activityId });
                }
                return items;
            case Types.ContentTypes.ACTIVITY:
                return this.data.items;
            case Types.ContentTypes.ITEM:
                return [this.data];
            default:
                return [];
        }
    }

    public getActivities() {
        switch (this._contentType) {
            case Types.ContentTypes.PROGRAM:
                return this.data.activities;
            case Types.ContentTypes.ACTIVITY:
                return [this.data];
            default:
                return [];
        }
    }

    public getPrograms() {
        switch (this._contentType) {
            case Types.ContentTypes.PROGRAM:
                return [this.data];
            default:
                return [];
        }
    }
}