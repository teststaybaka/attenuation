import { DatastoreQuery, DatastoreFilter, DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';
import { PostEntry, POST_ENTRY } from '../../interface/post_entry';

export let POST_ENTRY_MODEL: DatastoreModelDescriptor<PostEntry> = {
  name: "PostEntry",
  key: "id",
  excludedIndexes: ["id", "content"],
  valueDescriptor: POST_ENTRY,
}

export class DescendQueryBuilder {
  private datastoreQuery: DatastoreQuery<PostEntry> = {
    modelDescriptor: POST_ENTRY_MODEL,
    filters: new Array<DatastoreFilter>(),
    orderings: [
      {
        fieldName: "created",
        descending: true
      },
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
  public equalToUserId(value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "userId",
      fieldValue: value,
      operator: "=",
    });
    return this;
  }
  public build(): DatastoreQuery<PostEntry> {
    return this.datastoreQuery;
  }
}