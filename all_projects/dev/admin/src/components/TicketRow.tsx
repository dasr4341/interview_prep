import { GetTickets_pretaaGetFilteredTickets } from 'generatedTypes';
import { DisclosureIcon } from './icons/DisclosureIcon';
import { differenceInCalendarDays, format, formatDistanceToNow } from 'date-fns';

export function TicketRow({ ticket }: { ticket: GetTickets_pretaaGetFilteredTickets }) {
  return (
    <div
      className={`flex flex-row items-center justify-between pl-4 pr-6 py-4
    ${ticket.status ? 'bg-white' : 'bg-gray-100'} border-b border-gray-300
    lg:h-28`}>
      <div
        className={`flex flex-col justify-around 
      `}>
        <div
          className="flex justify-between items-center lg:-mb-2 mb-0
        text-primary text-xxs lg:text-xs font-semibold text-opacity-50">
          <span className="uppercase">Category/{ticket.groupName}</span>
        </div>
        <div className="flex items-center justify-between">
          <h3
            className={`${ticket.status ? 'font-bold' : 'font-medium'} text-xs sm:text-sm lg:text-base text-primary 
        lg:mb-0 mb-2 py-1`}>
            Ticket # • {ticket.title}
          </h3>
        </div>
        <div className="flex flex-row">
          {ticket.type && (
            <span
              className="mr-1.5
          font-bold focus:outline-none px-2.5 py-1 rounded-full
          text-xxs uppercase whitespace-nowrap
           text-gray-700 flex items-center"
              style={{ backgroundColor: '#E5E5EF' }}>
              {ticket?.type}
            </span>
          )}
          <span
            className={`mr-1.5 border ${
              ticket.status === 'open' ? 'border-pt-blue-300 bg-pt-blue-300' : 'border-gray-150 bg-gray-150'
            }
          font-semibold focus:outline-none 
          px-2.5 py-1 rounded-full
          text-xxs uppercase whitespace-nowrap 
          text-white flex items-center`}>
            {ticket.status === 'open' ? 'Open' : ticket.status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center font-medium">
        <div className="flex flex-col text-gray-600 min-h-10 min-w-max text-xxs lg:text-sm 
         px-4 mr-3 lg:mr-5 border-r border-gray-400">
          {ticket.status === 'closed' && 
            <div className="text-right">
              <p>Opened - {
                  format(new Date(parseInt(ticket.raisedDate)), 'dd MMM yyyy')
                }
             </p>
             <p>Closed - {ticket.ticketUpdatedAt !== null &&
                format(new Date(parseInt(ticket.ticketUpdatedAt)), 'dd MMM yyyy')
              } </p>
              <p>{ticket.ticketUpdatedAt !== null && 
              differenceInCalendarDays(
                new Date(parseInt(ticket.ticketUpdatedAt)),
                new Date(parseInt(ticket.raisedDate)),
              )}{' '}
              days open</p>
            </div>
          }
          {ticket.status !== 'closed' && <>
            {formatDistanceToNow(new Date(+ticket.raisedDate), { addSuffix: true })} open
          </>}
        </div>
        
        <button>
          <a href={ticket?.url} target={'_blank'}>
            <DisclosureIcon />
          </a>
        </button>
      </div>
    </div>
  );
}
