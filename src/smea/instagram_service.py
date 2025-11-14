import time
import os
from typing import Dict, List, Optional
from apify_client import ApifyClient

class InstagramService:
    def __init__(self, apify_token: str):
        self.apify_token = apify_token
        self.client = ApifyClient(apify_token)
        # updated to the actor ID from your example - this is the correct Instagram scraper
        self.actor_id = 'shu8hvrXbJbY3Eb9W'

    def get_user_data(self, username: str) -> Dict:
        """scrapes Instagram user data using Apify"""
        try:
            if not username:
                raise ValueError('Username is required')

            # prepares actor input for Instagram scraper
            run_input = {
                "directUrls": [f"https://www.instagram.com/{username}/"],
                "resultsType": "posts",
                "resultsLimit": 50,
                "addParentData": False  # Disabled to speed up scraping
            }

            # runs the actor and wait for it to finish
            run = self.client.actor(self.actor_id).call(run_input=run_input)
            
            # fetches results from the run's dataset
            items = list(self.client.dataset(run["defaultDatasetId"]).iterate_items())
            
            if not items:
                raise ValueError('No data returned from Instagram scraper')

            processed_data = self._process_results(items, username)
            
            return {
                'platform': 'instagram',
                'user': processed_data['user'],
                'media': processed_data['media'],
                'biography': processed_data['biography'],
                'fetchedAt': time.time()
            }

        except Exception as e:
            raise Exception(f'Instagram service error: {str(e)}')


    def _process_results(self, results: List[Dict], username: str) -> Dict:
        """processes raw Apify results"""
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
        """extracts text content for PII analysis"""
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
        """validates Apify token - modified to be more permissive"""
        try:
            # First try to access the Instagram actor
            try:
                actor_info = self.client.actor(self.actor_id).get()
                return {
                    'valid': True, 
                    'message': f'Instagram scraper accessible: {actor_info.get("name", "Unknown")}',
                    'actor_id': self.actor_id
                }
            except Exception as actor_error:
                # If actor access fails, try a basic API call to test token validity
                try:
                    # Try to get user info as a fallback test
                    user_info = self.client.user().get()
                    return {
                        'valid': True, 
                        'message': f'Token valid for user {user_info.get("username", "Unknown")}, but Instagram actor access limited',
                        'warning': f'Actor access failed: {str(actor_error)}'
                    }
                except Exception as user_error:
                    # If both fail, the token is definitely invalid
                    return {'valid': False, 'error': f'Token validation failed: {str(user_error)}'}
        except Exception as e:
            return {'valid': False, 'error': f'General validation error: {str(e)}'}

    @staticmethod
    def create_service(apify_token: Optional[str] = None) -> 'InstagramService':
        """creates service with token from environment"""
        token = apify_token or os.getenv('APIFY_TOKEN')
        if not token:
            raise ValueError('APIFY_TOKEN not found in environment variables')
        return InstagramService(token)