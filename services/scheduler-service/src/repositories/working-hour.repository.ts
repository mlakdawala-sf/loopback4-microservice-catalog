import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourcefuse-service-catalog/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Calendar, WorkingHour, WorkingHourRelations} from '../models';
import {CalendarRepository} from './calendar.repository';

export class WorkingHourRepository extends DefaultUserModifyCrudRepository<
  WorkingHour,
  typeof WorkingHour.prototype.id,
  WorkingHourRelations
> {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof WorkingHour.prototype.id
  >;

  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('CalendarRepository')
    protected calendarRepositoryGetter: Getter<CalendarRepository>,
  ) {
    super(WorkingHour, dataSource, getCurrentUser);

    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );

    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}