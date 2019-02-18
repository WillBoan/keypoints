# movies-api/movies/api/tests/test_views.py

from django.shortcuts import reverse

from rest_framework.test import APITestCase

from api.models import Movie


class TestNoteApi(APITestCase):
    def setUp(self):
        # create movie
        self.movie = Movie(name="The Space Between Us", year_of_release=2017)
        self.movie.save()

    def test_movie_creation(self):
        response = self.client.post(reverse('movies'), {
            'name': 'Bee Movie',
            'year_of_release': 2007
        })

        # assert new movie was added
        self.assertEqual(Movie.objects.count(), 2)

        # assert a created status code was returned
        self.assertEqual(201, response.status_code)

    def test_getting_movies(self):
        response = self.client.get(reverse('movies'), format="json")
        self.assertEqual(len(response.data), 1)

    def test_updating_movie(self):
        response = self.client.put(reverse('detail', kwargs={'pk': 1}), {
            'name': 'The Space Between Us updated',
            'year_of_release': 2017
        }, format="json")

        # check info returned has the update
        self.assertEqual('The Space Between Us updated', response.data['name'])

    def test_deleting_movie(self):
        response = self.client.delete(reverse('detail', kwargs={'pk': 1}))

        self.assertEqual(204, response.status_code)