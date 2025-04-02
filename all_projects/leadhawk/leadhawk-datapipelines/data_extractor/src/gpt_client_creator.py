# DEPENDENCIES
import os
import logging
import warnings
from openai import AsyncOpenAI
from dotenv import load_dotenv

# IGNORE ALL WARNINGS 
warnings.filterwarnings(action = 'ignore')


# LOGGING 
logger = logging.getLogger(__name__)


# LOAD ENVIRONMENT VARIABLES
load_dotenv()


# OPENAI CLIENT CREATOR
async def create_openai_client() -> AsyncOpenAI:
    """
    Creates / initializes the OpenAI client for the GPT-3.5-Turbo-Instruct model

    Errors:
    -------
        EnvironmentVariableError : If required environment variables are not set or invalid type
        
        ClientCreationError      : If there is an error during the creation of the OpenAI client

    Returns:
    --------
           { Asynchronous }      : An instance of AsyncOpenAI client
    """
    # LOAD OPENAI API KEY
    openai_api_key = os.getenv(key = 'OPENAI_API_KEY')
    timeout        = int(os.getenv(key = 'GPT_TIMEOUT', default = 10))
    max_retries    = int(os.getenv(key = 'GPT_MAX_RETRIES', default = 5))
    
    # VALIDATE ENVIRONMENT VARIABLES
    if (not all([openai_api_key, max_retries, timeout])):
        error_message = ("EnvironmentVariableError: Missing required environment variables."
                         "Ensure 'OPENAI_API_KEY', 'TIMEOUT' & 'MAX_RETRIES' are set")
        
        logger.error(msg   = error_message, 
                     extra = {"request_id": "openai_client_creation"})
        
        return error_message
    
    try:
        # Initialize the Async OpenAI client
        openai_client = AsyncOpenAI(api_key     = openai_api_key,
                                    timeout     = timeout,
                                    max_retries = max_retries,
                                   )
        
        logger.info(msg   = 'Successfully created AsyncOpenAI API client', 
                    extra = {"request_id": "openai_client_creation"})
        
        return openai_client
    
    except Exception as ClientCreationError:
         exception_error_message = f"ClientCreationError: Error creating the AsyncOpenAI client: {repr(ClientCreationError)}"
         
         logger.error(msg      = exception_error_message, 
                      extra    = {"request_id": "openai_client_creation"}, 
                      exc_info = True)
         
         return exception_error_message
    

    