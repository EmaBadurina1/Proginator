from sqlalchemy import or_, not_
from models import Appointment, Therapy


def appointment_overlapping(patient_id, new_date_from, new_date_to):
    '''
    Returns True if new appointment overlaps with any of patient's appointments, False otherwise
    '''

    therapy_ids = Therapy.query.filter_by(patient_id=patient_id).with_entities(Therapy.therapy_id).all()
    therapy_ids = [therapy_id[0] for therapy_id in therapy_ids]

    # get all appointments that overlap with new appointment
    overlapping_appointments = (
        Appointment
        .query
        .filter(
            not_(
                or_(
                    Appointment.date_to <= new_date_from,
                    Appointment.date_from >= new_date_to
                )
            )
        )
        .filter(Appointment.therapy_id.in_(therapy_ids))
        .all()
    )
    if overlapping_appointments:
        return True
    else:
        return False