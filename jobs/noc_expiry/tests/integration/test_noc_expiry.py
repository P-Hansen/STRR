
from noc_expiry.job import update_status_for_noc_expired_applications
from sqlalchemy import text
from strr_api.models import db
from strr_api.models.application import Application
from strr_api.models.rental import Registration
import json


def test_noc_expiry(app):
    db.session.execute(text("DELETE FROM property_contacts"))
    db.session.execute(text("DELETE FROM property_listings"))
    db.session.execute(text("DELETE FROM rental_properties"))
    db.session.execute(text("DELETE FROM events"))
    db.session.execute(text("DELETE FROM application"))
    db.session.execute(text("DELETE FROM registrations"))
    db.session.execute(text("DELETE FROM registrations_history"))
    db.session.execute(text("DELETE FROM users"))
    db.session.commit()

    with open("test_registrations.json") as f:
        data = json.load(f)

    for row in data["users"]:
        db.session.execute(
            text(
                "INSERT INTO users (id, firstname, lastname) VALUES (:id, :firstname, :lastname)"),
            row
        )
    for row in data["application"]:
        row["application_json"] = json.dumps(row["application_json"])
        if "noc" in row and isinstance(row["noc"], dict):
            row["noc"] = json.dumps(row["noc"])
        db.session.execute(
            text("""
                INSERT INTO application (
                    id, application_json, application_date, type, status, invoice_id, payment_status_code, payment_completion_date, payment_account, submitter_id, application_number, created, registration_type, noc
                ) VALUES (
                    :id, :application_json, :application_date, :type, :status, :invoice_id, :payment_status_code, :payment_completion_date, :registration_id, :submitter_id, :application_number, :created, :registration_type, :noc
                )
            """), row
        )
    db.session.commit()

    # assert that an application with NOC_PENDING exists in the database
    result_before = db.session.execute(
        text(
            "SELECT COUNT(*) FROM application WHERE status = 'NOC_PENDING'")
    ).scalar_one()
    assert result_before == 2, "Expected one application"

    # Run the function
    update_status_for_noc_expired_applications(app)

    # assert that an application with NOC_EXPIRED exists in the database
    result_after = db.session.execute(
        text(
            f"SELECT COUNT(*) FROM application WHERE status = '{Application.Status.NOC_EXPIRED.text}'")
    ).scalar_one()
    assert result_after == 1, "Expected one application"
