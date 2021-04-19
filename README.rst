Blockbuster Clone
=================

Technical test:

Live URLS
Backend: https://whispering-beach-73464.herokuapp.com/BMG4hgkb6nTjhU73QLx7skvTyrFg2gyh/
    Note: Superuser is intended to be used only for developers  (alvaro:alexche77)
Frontend:https://blockbuster-fe-achvz.herokuapp.com/

Repositories:

BackendL https://github.com/alexche77/blockbuster-api-clone
Frontend: https://github.com/alexche77/blockbuster-fe-react

Postman collection invite link: https://app.getpostman.com/join-team?invite_code=26853aa5797e66955f1f777d5b631502&ws=00ae5a03-9e11-4a9d-b144-ebf4c349eddc

Requirements
--------------


[OK]Only users with admin role are allowed to perform the following actions:
[OK]Add a movie
[OK]Modify a movie
[OK]Remove a movie (Mark it as unavailable)
[OK]Delete a movie (SoftDelete via availability)
[OK]Movies must have a title, description, at least one image, stock, rental price, sale price and availability. (Information from movie is pulled from an external service and stored in our database)
[OK]Availability is a field of movies, which may only be modified by an admin role.
[NOT_IMPL]Save a log of the title, rental price and sale price updates for a movie.
[PARTIALLY]Users can rent and buy a movie. For renting functionality you must keep track when the user have to return the movie and apply a monetary penalty if there is a delay. (Penalty to be implemented)
[OK]Keep a log of all rentals and purchases (who bought, how many, when). (Implemented as Orders and movements)
[NOT_IMPL]Users can like movies.
[PARTIALLY]As an admin I’m able to see all movies and filtering by availability/unavailability.
[OK]As an user I’m able to see only the available movies for renting or buying.
[NOT_IMPL]The list must be sortable by title (default), and by popularity (likes).
[OK]The list must have pagination functionality.
[NOT_IMPL]Search through the movies by name.


Security requirements
[OK]Add login/logout functionality.Preferably JWT.
[OK]Only admins can add/modify/remove movies.
[OK]Only logged in users can rent and buy movies.
[OK]Only logged in users can like movies.
[OK]Everyone (authenticated or not) can get the list of movies.
[OK]Everyone (authenticated or not) can get the detail of a movie.
[OK]Publish your work using heroku and share the link with us.
Extra credit
[NOT_IMPL]Recovery and forgot password functionality (send email).
[NOT_IMPL]Confirming account (send email)
[OK]Build a small frontend app and connecting to the API. (TBH, it was not that small jaja)
[OK]As an user with admin role I want to be able to change the role of any user.
[NOT_IMPL]Unit test, at least 80% of coverage.
[OK]Include a docker file for production deployments.



Commands and usage
--------------

Setting Up Your Users
^^^^^^^^^^^^^^^^^^^^^

* To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit you are good to go, automatically logged in

* To create an **superuser account**, use this command::

    $ docker-compose -f local.yml run --rm django python manage.py createsuperuser

Celery
^^^^^^

This app comes with Celery.

To run a celery worker:

.. code-block:: bash

    cd blockbuster_clone
    celery -A config.celery_app worker -l info

Please note: For Celery's import magic to work, it is important *where* the celery commands are run. If you are in the same folder with *manage.py*, you should be right.

Deployment
----------

The following details how to deploy this application.

Heroku
^^^^^^

See detailed `cookiecutter-django Heroku documentation`_.

.. _`cookiecutter-django Heroku documentation`: http://cookiecutter-django.readthedocs.io/en/latest/deployment-on-heroku.html

