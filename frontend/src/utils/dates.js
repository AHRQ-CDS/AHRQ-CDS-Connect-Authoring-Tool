import moment from 'moment';

export default function renderDate(datetime) {
  let formattedDate = '';
  if (datetime) { formattedDate = moment(datetime).fromNow(); }
  return formattedDate;
}
