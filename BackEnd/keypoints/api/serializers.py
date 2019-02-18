from rest_framework.serializers import ModelSerializer

from api.models import Movie

class MovieSerializer(ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'name', 'year_of_release')
        extra_kwargs = {
            'id': {'read_only': True}
        }