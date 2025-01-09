import os
import json
from flask import Flask, redirect, url_for, session, request, render_template
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import base64
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
app.secret_key = "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"
CLIENT_SECRETS_FILE = "client_secret.json"

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
REDIRECT_URI = 'http://localhost:5000/oauth2callback'

import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Google OAuth2 flow setup
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI
)


# Route für Startseite (Formular zum Anzeigen von E-Mails)
@app.route('/')
def index():
    return render_template('emails.html')

# Route für die Anzeige der E-Mails
@app.route('/emails', methods=['POST'])
def get_emails():
    sender_email = request.form['sender_email']
    
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    credentials = Credentials(**session['credentials'])
    gmail_service = build('gmail', 'v1', credentials=credentials)
    
    query = f"from:{sender_email}"
    response = gmail_service.users().messages().list(userId='me', q=query).execute()

    email_threads = []

    if 'messages' in response:
        for msg in response['messages']:
            msg_id = msg['id']
            message = gmail_service.users().messages().get(userId='me', id=msg_id).execute()

            payload = message['payload']
            headers = payload['headers']
            subject = None
            for header in headers:
                if header['name'] == 'Subject':
                    subject = header['value']

            snippet = message.get('snippet', '')
            email_threads.append({
                'id': msg_id,
                'subject': subject,
                'snippet': snippet
            })
    
    return jsonify(email_threads)

# Route für das Löschen von E-Mails
@app.route('/delete', methods=['POST'])
def delete_email():
    email_ids = request.json['email_ids']
    
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    credentials = Credentials(**session['credentials'])
    gmail_service = build('gmail', 'v1', credentials=credentials)
    
    for email_id in email_ids:
        gmail_service.users().messages().delete(userId='me', id=email_id).execute()
    
    return jsonify({'status': 'success'})

# Route für das Blockieren von E-Mails
@app.route('/block', methods=['POST'])
def block_email():
    sender_email = request.json['sender_email']
    
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    credentials = Credentials(**session['credentials'])
    gmail_service = build('gmail', 'v1', credentials=credentials)
    
    # Blockierungslogik (Label zuweisen, Filter erstellen etc.)
    label_id = "SPAM"
    query = f"from:{sender_email}"
    response = gmail_service.users().messages().list(userId='me', q=query).execute()
    
    if 'messages' in response:
        for msg in response['messages']:
            msg_id = msg['id']
            gmail_service.users().messages().modify(userId='me', id=msg_id, body={
                "addLabelIds": [label_id]
            }).execute()
    
    return jsonify({'status': 'success'})

# Newsletter abmelden
@app.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    email_id = request.json['email_id']
    
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    credentials = Credentials(**session['credentials'])
    gmail_service = build('gmail', 'v1', credentials=credentials)
    
    msg = gmail_service.users().messages().get(userId='me', id=email_id).execute()
    payload = msg['payload']
    parts = payload.get('parts', [])
    unsubscribe_link = None

    for part in parts:
        if part['mimeType'] == 'text/html':
            data = part['body']['data']
            decoded_data = base64.urlsafe_b64decode(data.encode('UTF-8')).decode('utf-8')
            soup = BeautifulSoup(decoded_data, 'html.parser')
            for link in soup.find_all('a', href=True):
                if 'unsubscribe' in link['href'].lower():
                    unsubscribe_link = link['href']
                    break

    if unsubscribe_link:
        requests.get(unsubscribe_link)
    
    return jsonify({'status': 'success'})

# OAuth2 Authorisierung
@app.route('/authorize')
def authorize():
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run('localhost', 5000, debug=True)