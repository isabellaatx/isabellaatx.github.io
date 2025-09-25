function updateLocationOptions(value)
{
    const locationField = document.getElementById('location_field');
    const remoteUrlField = document.getElementById('remote_url_field');
    const attendeesField = document.getElementById('attendees_field');

    locationField.classList.add('d-none');
    remoteUrlField.classList.add('d-none');
    attendeesField.classList.add('d-none');

    document.getElementById('event_location').required = false;
    document.getElementById('event_remote_url').required = false;
    document.getElementById('event_attendees').required = false;

    if (value == 'in-person')
    {
        locationField.classList.remove('d-none');
        attendeesField.classList.remove('d-none');
        document.getElementById('event_location').required = false;
        document.getElementById('event_attendees').required = false;
    }
    else if (value == 'remote')
    {
        remoteUrlField.classList.remove('d-none');
        attendeesField.classList.remove('d-none');
        document.getElementById('event_remote_url').required = false;
        document.getElementById('event_attendees').required = false;
    }
}

const events = [];
let in_editing_mode = null;

function saveEvent()
{
    const name = document.getElementById('event_name').value;
    const category = document.getElementById('event_category').value;
    const weekday = document.getElementById('event_weekday').value;
    const time = document.getElementById('event_time').value;
    const modality = document.getElementById('event_modality').value;
    
    let location = null;
    let remote_url = null; 
    
    if(modality == 'in-person')
    {
        location = document.getElementById('event_location').value;
    }
    if(modality == 'remote')
    {
        remote_url = document.getElementById('event_remote_url').value;
    }
    
    let attendees = [];
    const unsplitAttendees = document.getElementById('event_attendees').value;
    if (unsplitAttendees !== "") 
    {
        let temp = unsplitAttendees.split(",");
        for (var i = 0; i < temp.length; i++) 
        {
            attendees.push(temp[i].trim());
        }
    }

    const eventDetails = {
        name, // name of the event from the form,
        category,
        weekday, //weekday of the event from the form,
        time, //time of the event from the form,
        modality, //modality of the event from the form,
        location, //if the modality is "In-person" then this has a value and remote_url is null,
        remote_url, //if the modality is "Remote" then this has a value location is null,
        attendees //list of attendees from the form
    };

    if(in_editing_mode == null)
    {
        events.push(eventDetails);
        console.log('Events array:', events);
        addEventToCalendarUI(eventDetails);
    }
    else
    {
        events[in_editing_mode] = eventDetails;
        let allcards = document.querySelectorAll('.event');
        let updateCard = allcards[in_editing_mode];
        let newcard = createEventCard(eventDetails);
        updateCard.replaceWith(newcard);
        in_editing_mode = null;

    }
    document.getElementById('event_form').reset();
    updateLocationOptions('');

    let modalElement = document.getElementById('event_modal');
    let modalOpen = bootstrap.Modal.getInstance(modalElement);
    modalOpen.hide();
}

function createEventCard(eventDetails)
{
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1'

    switch(eventDetails.category)
    {
        case 'Academic':
            event_element.style.backgroundColor = '#abeb61ff';
            break;
        case 'Work':
            event_element.style.backgroundColor = '#7bb4e6ff';
            break;
        case 'Leisure':
            event_element.style.backgroundColor = '#b8aa4eff';
            break;
        case 'Errand':
            event_element.style.backgroundColor = '#ae639dff';
            break;
        case 'Appointment':
            event_element.style.backgroundColor = '#c75c5cff';
            break;
        case 'Other':
            event_element.style.backgroundColor = '#c8c8c8ff';
            break;
    }

    let info = document.createElement('div');

    let name = eventDetails.name;
    let category = eventDetails.category;
    let time = eventDetails.time;
    let modality = eventDetails.modality;
    let location = eventDetails.location;
    let remote_url = eventDetails.remote_url
    let attendees = eventDetails.attendees.join(', ');

    info.innerHTML = `
        <strong>${name}</strong><br>
        ${time} - ${modality === 'in-person' ? 'Location: ' + location : 'Remote URL: ' + remote_url}<br>
        Attendees: ${attendees}
    `;

    event_element.appendChild(info);

    event_element.onclick = function()
    {
        openEditEvent(eventDetails);
    };

    return event_element;
}

function addEventToCalendarUI(eventInfo)
{
    let event_card = createEventCard(eventInfo);
    let day_div = document.getElementById(eventInfo.weekday.toLowerCase());
    if(day_div)
    {
        day_div.appendChild(event_card);
    }
}

function openEditEvent(eventDetails)
{
    in_editing_mode = events.indexOf(eventDetails);
    document.getElementById('event_name').value = eventDetails.name;
    document.getElementById('event_category').value = eventDetails.category;
    document.getElementById('event_weekday').value = eventDetails.weekday;
    document.getElementById('event_time').value = eventDetails.time;
    document.getElementById('event_modality').value = eventDetails.modality;

    if (eventDetails.modality === 'in-person') 
    {
        updateLocationOptions('in-person');
        document.getElementById('event_location').value = eventDetails.location || '';
        document.getElementById('event_attendees').value = eventDetails.attendees.join(', ');
    } else if (eventDetails.modality === 'remote') 
    {
        updateLocationOptions('remote');
        document.getElementById('event_remote_url').value = eventDetails.remote_url || '';
        document.getElementById('event_attendees').value = eventDetails.attendees.join(', ');
    } else 
    {
        updateLocationOptions('');
    }

    let modalElement = document.getElementById('event_modal');
    let modalOpen = bootstrap.Modal.getInstance(modalElement);
    modalOpen.show();
}