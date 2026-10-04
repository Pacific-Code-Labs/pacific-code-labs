"""Initialize public assets and the first snapshot; never overwrite a live snapshot."""
import os, sys
from pathlib import Path
from datetime import datetime, timezone
import boto3
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'be/management-be'))
from app.repositories.s3_repository import S3Repository
from app.domain import CONTENT_KEYS
from app.content_validation import validate_content
s3=boto3.client('s3')
for file in (root/'fe/landing/public/media/products').glob('*.png'):
 s3.put_object(Bucket=os.environ['MEDIA_BUCKET'],Key='media/products/'+file.name,Body=file.read_bytes(),ContentType='image/png',CacheControl='public, max-age=31536000, immutable')
repo=S3Repository(s3,os.environ['MEDIA_BUCKET'])
previous,etag=repo.read('published/landing.json',{})
if etag:
 print('Published content already exists; publish subsequent changes from the admin.');sys.exit(0)
source,_=S3Repository(s3,os.environ['DATA_BUCKET']).read('admin/content.json',{})
for key in CONTENT_KEYS:validate_content(key,source['data'][key]['data'])
doc={'content':{k:source['data'][k]['data'] for k in CONTENT_KEYS if not k.startswith('translations-')},'translations':{lang:source['data']['translations-'+lang]['data'] for lang in ('en','es')},'version':1,'sourceVersion':source['version'],'publishedAt':datetime.now(timezone.utc).isoformat()}
repo.replace('published/landing.json',doc,None,cache_control='public, max-age=60')
print('Published the initial landing content snapshot.')
