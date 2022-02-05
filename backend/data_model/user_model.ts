import { DatastoreQuery, DatastoreFilter, DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';
import { User, USER } from '../../interface/user';

export let USER_MODEL: DatastoreModelDescriptor<User> = {
  name: "User",
  key: "id",
  excludedIndexes: ["id", "email", "hashedPassword", "created"],
  valueDescriptor: USER,
}

export class FindUserQueryBuilder {
  private datastoreQuery: DatastoreQuery<User> = {
    modelDescriptor: USER_MODEL,
    filters: new Array<DatastoreFilter>(),
    orderings: [
    ]
  };

  public start(cursor: string): this {
    this.datastoreQuery.startCursor = cursor;
    return this;
  }
  public limit(num: number): this {
    this.datastoreQuery.limit = num;
    return this;
  }
  public equalToUsername(value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "username",
      fieldValue: value,
      operator: "=",
    });
    return this;
  }
  public build(): DatastoreQuery<User> {
    return this.datastoreQuery;
  }
}
