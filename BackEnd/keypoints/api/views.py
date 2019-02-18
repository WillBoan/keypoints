from django.shortcuts import render

# Create your views here.
# movies-api/movies/api/views.py

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from api.models import Movie
from api.serializers import MovieSerializer


class MovieCreateView(ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer