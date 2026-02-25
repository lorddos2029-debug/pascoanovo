import os
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from base64 import b64encode
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

def _find_value(obj, keys):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in keys and isinstance(v, (str, int, float)) and v:
                return v
            found = _find_value(v, keys)
            if found:
                return found
    elif isinstance(obj, list):
        for item in obj:
            found = _find_value(item, keys)
            if found:
                return found
    return None

def _normalize_qr_value(val):
    if not isinstance(val, str) or not val:
        return ''
    s = val.strip()
    if s.startswith('http://') or s.startswith('https://'):
        return s
    if s.startswith('data:image'):
        return s
    # assume base64 png
    return 'data:image/png;base64,' + s

@app.route('/api/pix/create', methods=['POST'])
def create_pix():
    secret = os.getenv('PAYEVO_SECRET', '')
    if not secret:
        return jsonify({'error': 'missing_secret'}), 400
    try:
        data = request.get_json(force=True) or {}
        amount = float(data.get('amount', 0))
        customer = data.get('customer', {})
        body = {
            'amount': f"{amount:.2f}",
            'payment': {'method': 'pix'},
            'customer': {
                'name': customer.get('name'),
                'email': customer.get('email'),
                'document': customer.get('document'),
                'phone': customer.get('phone')
            },
            'description': data.get('description', 'Pedido PIX')
        }
        payload = json.dumps(body).encode('utf-8')
        auth = 'Basic ' + b64encode(secret.encode('utf-8')).decode('utf-8')
        req = Request(
            'https://apiv2.payevo.com.br/functions/v1/transactions',
            data=payload,
            headers={'Content-Type': 'application/json', 'Authorization': auth},
            method='POST'
        )
        with urlopen(req, timeout=20) as resp:
            resp_body = resp.read().decode('utf-8')
            data = json.loads(resp_body)
            qr = _find_value(data, {
                'qrCode','qrcode','qr_code','qr','qr_image','qrCodeImage','qrcode_image'
            }) or ''
            emv = _find_value(data, {
                'payload','emv','pixCopiaCola','pix_copia_cola','code','pix_code','copia_e_cola','copiaCola'
            }) or ''
            qr = _normalize_qr_value(qr)
            return jsonify({'raw': data, 'qrCode': qr, 'payload': emv})
    except HTTPError as e:
        try:
            err = e.read().decode('utf-8')
        except Exception:
            err = str(e)
        return jsonify({'error': 'http_error', 'detail': err}), 502
    except URLError as e:
        return jsonify({'error': 'network_error', 'detail': str(e)}), 502
    except Exception as e:
        return jsonify({'error': 'unexpected_error', 'detail': str(e)}), 500

@app.route('/')
def root():
    return send_from_directory('.', 'store.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8000'))
    app.run(host='0.0.0.0', port=port)
