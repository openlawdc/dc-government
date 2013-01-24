var filters = d3.select('body').append('div').attr('class', 'filters');
var filterCommittees = filters.append('div');

var table = d3.select('body').append('table');

var parties = d3.scale.ordinal()
    .domain(['Democratic Party', 'Independent'])
    .range(['#D4E9FF', '#EBEBEB']);

d3.json('committees.json', function(error, committees) {
d3.json('council.json', function(error, council) {

    var filterCommitteesA = filterCommittees.selectAll('a.filter-committee')
        .data(committees)
        .enter()
        .append('a')
        .attr('class', 'filter-committee')
        .text(String)
        .on('click', function() {
            var c = d3.select(this).datum();
            filterCommitteesA.classed('selected', function(f) {
                return f == c;
            });
            draw(function(d) {
                return d3.keys(d.roles).indexOf(c) !== -1;
            });
        });

    var columns = d3.keys(council[0]);

    table.append('thead')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(String);

    var tbody = table.append('tbody')


    function draw(filter) {

        var tr = tbody.selectAll('tr').data(council.filter(filter || d3.functor(true)), function(d) {
            return d.name;
        });

        tr.exit().remove();
        tr.enter().append('tr');

        var tds = tr.selectAll('td')
            .data(function(d) {
                return columns.map(function(c) {
                    return d[c];
                });
            });

        tds.enter()
            .append('td')
            .html(function(d) {
                if (d.length) return d;
                return d3.entries(d).map(function(x) {
                    if (x.value.indexOf('@') !== -1) {
                        return x.key + ': <a href="mailto:' + x.value + '">' + x.value + '</a>';
                    } else {
                        return x.key + ': ' + x.value;
                    }
                }).join('<br />');
            });

        tr.style('background', function(d) {
            return parties(d.affiliation);
        })
    }

    draw();

});
});


