import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthUtil } from '../services/auth.util';

@Injectable()
export class AuthorisedStationsPipe implements PipeTransform {

  // TODO. Not sure if this is an acceptable way of getting the request object froom a pipe.
  // Check if there are better ways of getting the request object or in this case the session in a pipe.
  constructor(@Inject(REQUEST) private readonly request: Request) {
  }


  public transform(value: any, metadata: ArgumentMetadata) {

    console.log('AuthorisedStationsPipe metadata', metadata);

    const user = AuthUtil.getSessionUser(this.request);
    if (!user) {
      return value;
    }


    // Admins are allowed to access all or any station
    // Users that don't have authorised stations are also allowed to access all or any station
    if (AuthUtil.sessionUserIsAdmin(this.request) || !user.authorisedStationIds) {
      return value;
    }


    if (metadata.metatype === Array) {

      const stationIds = this.getValidStations(value, user.authorisedStationIds);

      if (stationIds) {
        return stationIds;
      } else {
        throw new BadRequestException();
      }

    }else if(metadata.metatype === String){
      const stationIds = this.getValidStations([value], user.authorisedStationIds);

      if (stationIds) {
        return stationIds[0];
      } else {
        throw new BadRequestException();
      }
    }


    //todo. do validation
    return value;
  }

  private getValidStations(requestedIds: string[] | null, authorisedIds: string[]): string[] | null {
    //If there are any requested ids, then validate them, if not then just return the authorised ids
    if (requestedIds && requestedIds.length > 0) {
        const isValid = requestedIds.every(id => authorisedIds.includes(id));
        return isValid ? requestedIds : null;
    } else {
        return authorisedIds;
    }
}


}
