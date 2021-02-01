import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { Log } from '../utils/Log';
const timeUuid = require('time-uuid');

export abstract class AbstractPersistentModel {

    public abstract doUpdate(json: any): boolean;
    protected abstract getType(): string;

    public abstract toJSON(): any;

    public id: string;

    constructor(id?: string) {
        this.id = id || timeUuid();
    }
    public update(json: any): Promise<AbstractPersistentModel> {
        Log.debug('update persistent model for ' + this.constructor.name + ' is ', json);
        let changed = this.doUpdate(json);
        if (changed) {
            return this.save();
        }
        else return Promise.resolve(this);
    }
    public save(): Promise<AbstractPersistentModel> {
        Log.debug("Saving model "+this.constructor.name+" with id "+this.id);
        return ElasticsearchClient.getInstance().update(this.getType(), this.id, this.toJSON(), true)
            .then(() => {
                return this;
            });
    }
    public delete() {
        return ElasticsearchClient.getInstance().delete(this.getType(), this.id);
    }
	public getUuid(): string {
		return this.id;
	}
}