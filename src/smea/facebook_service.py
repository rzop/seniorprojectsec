import time
import os
from typing import Dict, List, Optional
from apify_client import ApifyClient

class FacebookService:
    def __init__(self, apify_token: str):
        self.apify_token = apify_token
        self.client = ApifyClient(apify_token)
        # Facebook Posts Scraper actor ID from Apify
        self.actor_id = 'KoJrdxJCTtpon81KY'

    def get_user_data(self, page_url: str) -> Dict:
        """scrapes Facebook page data using Apify"""
        try:
            if not page_url:
                raise ValueError('Page URL is required')

            # Clean and validate the URL
            if not page_url.startswith('http'):
                page_url = f"https://www.facebook.com/{page_url}"
            
            # Remove trailing slash and ensure proper format
            page_url = page_url.rstrip('/')

            # prepares actor input for Facebook scraper - optimized for speed
            run_input = {
                "startUrls": [{"url": page_url}],
                "resultsLimit": 35,  # Reduced to 35 for faster scraping (Facebook is slower than Instagram)
                "captionText": True,
                "includeComments": False,  # Disabled for faster scraping
                "maxComments": 0,  # No comments for speed optimization
                "scrapeAbout": False,  # Skip about section for speed
                "scrapeReviews": False,  # Skip reviews for speed
                "scrapeServices": False,  # Skip services for speed
                "scrapePosts": True,  # Only scrape posts
            }

            # runs the actor and wait for it to finish (with timeout for speed)
            run = self.client.actor(self.actor_id).call(
                run_input=run_input,
                timeout_secs=120  # 2 minute timeout to fail fast
            )
            
            # fetches results from the run's dataset (limit to speed up)
            dataset = self.client.dataset(run["defaultDatasetId"])
            items = list(dataset.iterate_items(limit=35))  # Limit for speed
            
            if not items:
                raise ValueError('No data returned from Facebook scraper')

            processed_data = self._process_results(items, page_url)
            
            return {
                'platform': 'facebook',
                'user': processed_data['user'],
                'posts': processed_data['posts'],
                'page_info': processed_data['page_info'],
                'fetchedAt': time.time()
            }

        except Exception as e:
            raise Exception(f'Facebook service error: {str(e)}')

    def _process_results(self, results: List[Dict], page_url: str) -> Dict:
        """processes raw Apify results - optimized for speed"""
        # Extract page info from the first result or create default
        first_result = results[0] if results else {}
        
        # Extract page name from URL
        page_name = page_url.split('/')[-1] if '/' in page_url else page_url
        
        # Minimal user data for speed
        user = {
            'id': first_result.get('pageId', page_name),
            'username': page_name,
            'accountType': 'page',
            'postsCount': len(results),
            'name': first_result.get('pageName', page_name),
            'profilePictureUrl': '',  # Skip for speed
            'followersCount': 0,  # Skip for speed
            'likesCount': 0  # Skip for speed
        }

        # Only extract essential post data for PII analysis
        posts = {
            'data': [
                {
                    'id': item.get('postId', item.get('id', '')),
                    'type': 'POST',
                    'message': item.get('text', ''),
                    'caption': item.get('text', ''),
                    'timestamp': item.get('createdTime', ''),
                    'permalink': item.get('url', ''),
                    'url': item.get('url', ''),
                    'likesCount': 0,  # Skip for speed
                    'commentsCount': 0,  # Skip for speed
                    'sharesCount': 0,  # Skip for speed
                    'comments': []  # No comments for speed
                }
                for item in results
                if item.get('text', '').strip()  # Only include posts with text
            ],
            'count': len(results)
        }

        # Minimal page info
        page_info = {
            'name': first_result.get('pageName', page_name),
            'description': first_result.get('pageDescription', ''),
            'category': '',  # Skip for speed
            'website': '',  # Skip for speed
            'location': ''  # Skip for speed
        }

        return {'user': user, 'posts': posts, 'page_info': page_info}

    def _process_comments(self, comments) -> List[Dict]:
        """processes Facebook comments"""
        # Handle case where comments might be an integer (count) or None
        if not comments or isinstance(comments, (int, str)):
            return []
        
        # Ensure comments is a list
        if not isinstance(comments, list):
            return []
        
        return [
            {
                'id': comment.get('commentId'),
                'text': comment.get('text', ''),
                'author': comment.get('authorName', ''),
                'timestamp': comment.get('createdTime'),
                'likesCount': comment.get('likesCount', 0)
            }
            for comment in comments[:10]  # Limit to first 10 comments
        ]

    def extract_text_content(self, user_data: Dict) -> Dict:
        """extracts text content for PII analysis"""
        text_content = {
            'bio': user_data.get('page_info', {}).get('description', ''),
            'posts': [],
            'comments': []
        }

        if user_data.get('posts', {}).get('data'):
            # Only include posts with actual text content for faster processing
            text_content['posts'] = [
                post['message']
                for post in user_data['posts']['data']
                if post.get('message', '').strip()
            ]

        return text_content

    def validate_token(self) -> Dict:
        """validates Apify token"""
        try:
            # First try to access the Facebook actor
            try:
                actor_info = self.client.actor(self.actor_id).get()
                return {
                    'valid': True, 
                    'message': f'Facebook scraper accessible: {actor_info.get("name", "Unknown")}',
                    'actor_id': self.actor_id
                }
            except Exception as actor_error:
                # If actor access fails, try a basic API call to test token validity
                try:
                    # Try to get user info as a fallback test
                    user_info = self.client.user().get()
                    return {
                        'valid': True, 
                        'message': f'Token valid for user {user_info.get("username", "Unknown")}, but Facebook actor access limited',
                        'warning': f'Actor access failed: {str(actor_error)}'
                    }
                except Exception as user_error:
                    # If both fail, the token is definitely invalid
                    return {'valid': False, 'error': f'Token validation failed: {str(user_error)}'}
        except Exception as e:
            return {'valid': False, 'error': f'General validation error: {str(e)}'}

    @staticmethod
    def create_service(apify_token: Optional[str] = None) -> 'FacebookService':
        """creates service with token from environment"""
        token = apify_token or os.getenv('APIFY_TOKEN')
        if not token:
            raise ValueError('APIFY_TOKEN not found in environment variables')
        return FacebookService(token)

