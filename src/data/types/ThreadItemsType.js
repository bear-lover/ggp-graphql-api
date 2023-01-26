import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';
// Models
import { CancellationDetails } from '../models'
// Types
import CancellationDetailsType from './CancellationDetailsType';
import moment from 'moment';
const ThreadItemsType = new ObjectType({
    name: 'ThreadItems',
    fields: {
        id: {
            type: IntType
        },
        threadId: {
            type: IntType
        },
        reservationId: {
            type: IntType
        },
        sentBy: {
            type: StringType
        },
        content: {
            type: StringType
        },
        type: {
            type: StringType
        },
        startDate: {
            type: StringType,
            resolve(thread) {
                return thread && thread.startDate ? moment.utc(`${thread.startDate} 12:00`).valueOf() : "";
            }
        },
        endDate: {
            type: StringType,
            resolve(thread) {
                return thread && thread.endDate ? moment.utc(`${thread.endDate} 12:00`).valueOf() : ""
            }
        },
        personCapacity: {
            type: IntType
        },
        isRead: {
            type: BooleanType
        },
        createdAt: {
            type: StringType
        },
        status: {
            type: IntType
        },
        userBanStatus: {
            type: IntType
        },
        cancelData: {
            type: CancellationDetailsType,
            resolve(threadItems) {
                return CancellationDetails.findOne({ where: { reservationId: threadItems.reservationId } });
            }
        },
        userBanStatus: {
            type: IntType
        },
        errorMessage: { type: StringType }
    }
});
export default ThreadItemsType;