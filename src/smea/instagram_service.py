import requests
import time
import os
from typing import Dict, List, Optional

class InstagramService:
    def __init__(self, apify_token: str):
        self.apify_token = apify_token
        self.base_url = 'https://api.apify.com/v2'
        self.actor_id = 'apify/instagram-scraper'
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {apify_token}',
            'Content-Type': 'application/json'
        })

    def get_user_data(self, username: str) -> Dict:
        """Scrape Instagram user data using Apify"""
        try:
            if not username:
                raise ValueError('Username is required')

            run_data = {
                'directUrls': [f'https://www.instagram.com/{username}/'],
                'resultsType': 'posts',
                'resultsLimit': 25,
                'addParentData': True,
                'extendOutputFunction': '($) => { return {}; }',
                'customData': ''
            }

            run_response = self.session.post(
                f'{self.base_url}/acts/{self.actor_id}/runs',
                json=run_data,
                timeout=30
            )
            run_response.raise_for_status()
            
            run_id = run_response.json()['data']['id']
            results = self._wait_for_completion(run_id)
            
            if not results:
                raise ValueError('No data returned from Instagram scraper')

            processed_data = self._process_results(results, username)
            
            return {
                'platform': 'instagram',
                'user': processed_data['user'],
                'media': processed_data['media'],
                'biography': processed_data['biography'],
                'fetchedAt': time.time()
            }

        except Exception as e:
            raise Exception(f'Instagram service error: {str(e)}')

    def _wait_for_completion(self, run_id: str, max_wait_time: int = 300) -> List[Dict]:
        """Wait for Apify run to complete"""
        start_time = time.time()
        poll_interval = 5
        
        while time.time() - start_time < max_wait_time:
            try:
                status_response = self.session.get(
                    f'{self.base_url}/acts/{self.actor_id}/runs/{run_id}',
                    timeout=30
                )
                status_response.raise_for_status()
                
                status = status_response.json()['data']['status']
                
                if status == 'SUCCEEDED':
                    results_response = self.session.get(
                        f'{self.base_url}/acts/{self.actor_id}/runs/{run_id}/dataset/items',
                        timeout=30
                    )
                    results_response.raise_for_status()
                    return results_response.json()
                    
                elif status in ['FAILED', 'ABORTED', 'TIMED-OUT']:
                    raise Exception(f'Instagram scraping run failed with status: {status}')
                
                time.sleep(poll_interval)
                
            except requests.exceptions.RequestException as e:
                time.sleep(poll_interval)
        
        raise Exception('Instagram scraping run timed out')

    def _process_results(self, results: List[Dict], username: str) -> Dict:
        """Process raw Apify results"""
        first_result = results[0] if results else {}
        
        user = {
            'id': first_result.get('id', username),
            'username': username,
            'accountType': 'personal',
            'mediaCount': len(results),
            'followersCount': first_result.get('followersCount', 0),
            'followingCount': first_result.get('followingCount', 0),
            'name': first_result.get('fullName', ''),
            'profilePictureUrl': first_result.get('profilePicUrl', '')
        }

        media = {
            'data': [
                {
                    'id': item.get('id', item.get('shortCode')),
                    'type': item.get('type', 'IMAGE'),
                    'caption': item.get('caption', ''),
                    'timestamp': item.get('timestamp'),
                    'permalink': item.get('url'),
                    'url': item.get('displayUrl'),
                    'thumbnailUrl': item.get('displayUrl'),
                    'likesCount': item.get('likesCount', 0),
                    'commentsCount': item.get('commentsCount', 0),
                    'comments': []
                }
                for item in results
            ],
            'count': len(results)
        }

        biography = first_result.get('biography', '')
        return {'user': user, 'media': media, 'biography': biography}

    def extract_text_content(self, user_data: Dict) -> Dict:
        """Extract text content for PII analysis"""
        text_content = {
            'bio': user_data.get('biography', ''),
            'posts': [],
            'comments': []
        }

        if user_data.get('media', {}).get('data'):
            text_content['posts'] = [
                post.get('caption', '') 
                for post in user_data['media']['data']
            ]

        return text_content

    def validate_token(self) -> Dict:
        """Validate Apify token"""
        try:
            response = self.session.get(f'{self.base_url}/users/me', timeout=30)
            response.raise_for_status()
            return {'valid': True, 'data': response.json()['data']}
        except Exception as e:
            return {'valid': False, 'error': str(e)}

    @staticmethod
    def create_service(apify_token: Optional[str] = None) -> 'InstagramService':
        """Create service with token from environment"""
        token = apify_token or os.getenv('APIFY_TOKEN')
        if not token:
            raise ValueError('APIFY_TOKEN not found in environment variables')
        return InstagramService(token)